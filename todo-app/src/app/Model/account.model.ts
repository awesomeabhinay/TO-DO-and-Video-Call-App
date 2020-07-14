import { User } from './user/user.model';

export class Account{
    id: string;
    name: string;
    username: string;
    password: string;
    user: User;
}
