import { User } from './user/user.model';

export class Notification{
    id: string;
    code: string;
    senderName: string;
    user: User;
}
