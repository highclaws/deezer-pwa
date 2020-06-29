import Dexie from 'dexie';

class MyAppDatabase extends Dexie {
    public users: Dexie.Table<User, number>; 
    public groups: Dexie.Table<Group, number>; 
    public usersInGroups: Dexie.Table<UserInGroup, [number, number]>;
    constructor () {
        super("MyAppDatabase");
        this.version(1).stores({
            users: '++id, name',
            groups: '++id, name',
            usersInGroups: '[userId+groupId],userId,groupId'
        });
        this.users = this.table('users');
        this.groups = this.table('groups');
        this.usersInGroups = this.table('usersInGroups');
    }
}
const db = new MyAppDatabase();