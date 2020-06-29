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