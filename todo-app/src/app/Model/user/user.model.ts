export class User{
    id: string;
    name: string;
    email: string;
    password: string;

    constructor(id: string, name: string, email: string){
        this.id = id;
        this.name = name;
        this.email = email;
    }
}
