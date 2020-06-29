// Import stylesheets
import './style.css';

// Write TypeScript code!
const appDiv: HTMLElement = document.getElementById('app');
appDiv.innerHTML = `<h1>Dexie Many to Many TypeScript Starter</h1>`;

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

async function putUser(user:User) {
  await db.users.put(user);
}

async function putGroup(group:Group) {
  await db.groups.put(group);
}

async function putUserInGroup(user:User, group:Group) {
  await db.usersInGroups.put({userId: user.id, groupId: group.id});
}

async function removeUserFromGroup(user, group) {
  await db.table("usersInGroups").delete([user.id, group.id]);
}

async function getUserGroups(user) {
  const groupLinks = await db.usersInGroups.where({userId: user.id}).toArray();
  const groups = await Promise.all(groupLinks.map(link => db.table("groups").get(link.groupId)));
  return groups;
}
async function getGroupUsers(group) {
  const groupLinks = await db.usersInGroups.where({groupId: group.id}).toArray();
  const users = await Promise.all(groupLinks.map(link => db.table("users").get(link.userId)));
  return users;
}

function putUserInGroupC(user, group) {
  return db.transaction('rw', db.users, db.groups, db.usersInGroups, async () => {
    const [validUser, validGroup] = await Promise.all([
      db.users.where({id: user.id}).count(),
      db.groups.where({id: group.id}).count()
    ]);
    if (!validUser) throw new Error('Invalid user');
    if (!validGroup) throw new Error('Invalid group');
    await db.usersInGroups.put({userId: user.id, groupId: group.id});
  });  
}

function getUserGroupsC(user) {
  return db.transaction('r', db.usersInGroups, db.groups, async ()=>{
    const groupLinks = await db.usersInGroups.where({userId: user.id}).toArray();
    const groups = await Promise.all(groupLinks.map(link => db.groups.get(link.groupId)));
    return groups;
  });
}

async function test() {
   db.delete();
   db.open();
   await Promise.all([db.users.clear(), db.groups.clear(), db.usersInGroups.clear()]);

   /**
   | userid | groupid |
   | :----: | :-----: |
   |   1    |    1    |
   |   1    |    2    |
   |   2    |    3    |
   |   3    |    3    |
    */
   const user1 = new User('user1');
   await putUser(user1);
   const user2 = new User('user2');
   await putUser(user2);
   const user3 = new User('user3');
   await putUser(user3);

   const group1 = new Group('group1')
   await putGroup(group1);
   const group2 = new Group('group2');
   await putGroup(group2);
   const group3 = new Group('group3');
   await putGroup(group3);

   /**
   | userid | groupid |
   | :----: | :-----: |
   |   1    |    1    |
   |   1    |    2    |
   |   2    |    3    |
   |   3    |    3    |
    */

   await putUserInGroup(user1, group1);
   await putUserInGroup(user1, group2);
   await putUserInGroup(user2, group3);
   await putUserInGroup(user3, group3);

  let groupsForUser1 = await getUserGroups(user1);
  let groupsForUser2 = await getUserGroups(user2);
  let groupsForUser3 = await getUserGroups(user3);

  let usersForGroup1 = await getGroupUsers(user1);
  let usersForGroup2 = await getGroupUsers(user2);
  let usersForGroup3 = await getGroupUsers(user3);

   /**
   | userid | groupid |
   | :----: | :-----: |
   |   1    |    1    |
   |   1    |    2    |
   |   2    |    3    |
   |   3    |    3    |
    */

  console.log("groupsForUser1-[1,2]", JSON.stringify(groupsForUser1)); // Should log group1, group2
  console.log("groupsForUser2-[3]", JSON.stringify(groupsForUser2)); // Should log group3
  console.log("groupsForUser3-[3]", JSON.stringify(groupsForUser3)); // Should log group3

  console.log("usersForGroup1-[1]", JSON.stringify(usersForGroup1)); // Should log group1
  console.log("usersForGroup2-[1]", JSON.stringify(usersForGroup2)); // Should log group1
  console.log("usersForGroup3-[2,3]", JSON.stringify(usersForGroup3)); // Should log group1  
}
//Put a note in the tutorial about this
/**
putUserInGroup(user1, group1);
putUserInGroup(user2, group1);
 */

//putUserInGroupC(user1, group1);
//putUserInGroupC(user2, group1);
test();

let name:string = '';
if(name)  console.log('true');
