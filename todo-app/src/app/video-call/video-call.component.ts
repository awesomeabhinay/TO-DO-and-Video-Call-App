import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal, NgbAccordionConfig } from '@ng-bootstrap/ng-bootstrap';

const MESSAGE_TYPE = {
  SDP: 'SDP',
  CANDIDATE: 'CANDIDATE',
};

@Component({
  selector: 'app-video-call',
  templateUrl: './video-call.component.html',
  styleUrls: ['./video-call.component.css']
})
export class VideoCallComponent implements OnInit {

  @ViewChild('video1', { static: true }) video1: ElementRef<HTMLVideoElement>;
  @ViewChild('video2', { static: true }) video2: ElementRef<HTMLVideoElement>;
  code: any;
  peerConnection: any;
  signaling: any;
  senders: any = [];
  userMediaStream: any;
  displayMediaStream: any;
  disabled: boolean = true;
  codeInput: string;
  connected: boolean = false;
  constructor(private route: ActivatedRoute, private modealService: NgbModal,
              private config: NgbAccordionConfig) { }
  ngOnInit() {
    if (this.route.snapshot.params.id !== ''){
      this.code = this.route.snapshot.params.id;
      this.codeInput = this.code;
    }
    document.getElementById('start-button').addEventListener('click', async event => {
      if (this.code) {
        this.startChat();
        this.connected = true;
      }
    });
  }

  async startChat() {
    try {
      this.userMediaStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
      this.showChatRoom();

      this.signaling = new WebSocket('ws://127.0.0.1:1337');
      this.peerConnection = this.createPeerConnection();

      this.addMessageHandler();

      this.userMediaStream.getTracks().forEach(track => this.senders.push(this.peerConnection.addTrack(track, this.userMediaStream)));
      this.video1.nativeElement.srcObject = this.userMediaStream;
    }
    catch (err) {
      console.error(err);
    }
  }

  createPeerConnection() {
    const pc = new RTCPeerConnection({
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
    });

    pc.onnegotiationneeded = async () => {
      await this.createAndSendOffer();
    };

    pc.onicecandidate = (iceEvent) => {
      if (iceEvent && iceEvent.candidate) {
        this.sendMessage({
          message_type: MESSAGE_TYPE.CANDIDATE,
          content: iceEvent.candidate,
        });
      }
    };

    pc.ontrack = (event) => {
      // tslint:disable-next-line:variable-name
      const _video2 = this.video2.nativeElement;
      _video2.srcObject = event.streams[0];
    };

    return pc;
  }

  addMessageHandler() {
    this.signaling.onmessage = async message => {
      const data = JSON.parse(message.data);
      if (!data) {
        return;
      }

      const { message_type, content } = data;

      try {
        if (message_type === MESSAGE_TYPE.CANDIDATE && content) {
          await this.peerConnection.addIceCandidate(content);
        }
        else if (message_type === MESSAGE_TYPE.SDP) {
          if (content.type === 'offer') {
            await this.peerConnection.setRemoteDescription(content);
            const answer = await this.peerConnection.createAnswer();
            await this.peerConnection.setLocalDescription(answer);
            this.sendMessage({
              message_type: MESSAGE_TYPE.SDP,
              content: answer,
            });
          }
          else if (content.type === 'answer') {
            await this.peerConnection.setRemoteDescription(content);
          }
          else {
            console.log('unsupported SDP type.');
          }
        }
      }
      catch (err) {
        console.error(err);
      }
    };
  }

  async createAndSendOffer() {
    const offer = await this.peerConnection.createOffer();
    await this.peerConnection.setLocalDescription(offer);

    this.sendMessage({
      message_type: MESSAGE_TYPE.SDP,
      content: offer,
    });
  }

  sendMessage(message) {
    //const that = this;
    if (this.code) {
      const c = this.code;
      this.signaling.send(JSON.stringify({
        ...message,
        c,
      }));
    }
  }

  showChatRoom() {
    document.getElementById('start').style.display = 'none';
    document.getElementById('chat-room').style.display = 'flex';
  }

  async endCall(){
    this.userMediaStream.getTracks().forEach( (track) => {
      track.stop();
    });
    this.video1.nativeElement.srcObject = null;
    this.video2.nativeElement.srcObject = null;
  }

  open(content){
    this.modealService.open(content);
  }
}
