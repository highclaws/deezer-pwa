class User {
    id:number;
    name: string;
    groups:Group[];
    constructor(name:string) {this.name = name}
}

class Group {
    id:number;
    name: string;
    users:User[];
    constructor(name:string) {this.name=name}
}

class UserInGroup {
  id?: number;
  userId: number;
  groupId: number;
  constructor() {}
}