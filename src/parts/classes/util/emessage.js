class Emessage {
    constructor(message) {
        this._message = message;
        this._content = message.content;
        this._users = message.mentions.users.array();
        this._roles = message.mentions.roles.array();
    }

    get message() {
        return this._message;
    }

    set message(value) {
        this._message = value;
    }

    get content() {
        return this._content;
    }

    set content(value) {
        this._content = value;
    }

    get users() {
        return this._users;
    }

    set users(value) {
        this._users = value;
    }

    get roles() {
        return this._roles;
    }

    set roles(value) {
        this._roles = value;
    }

    parseMessage() {
        let content = findUserAlias(this.content);

        if(this.users.length > 0) {
            content = this.replaceMentions(this.users, content, "users");
        }
        if(this.roles.length > 0) {
            content = this.replaceMentions(this.roles, content, "roles");
        }

        this.content = content;
    }

    /**
     * @param {string} content - the content of the message in string for you
     * @returns {string} the content of the message with all aliases replaced
     */
    findUserAlias(content) {
        db.each("SELECT userAlias AS alias FROM userAlias", function (error, row) {
            let match = content.match(row.alias);
            if (match) {
                console.log(match[0]);
                content.replace(match[0], userReplace)
            }
        });
        return content;
    }

    replaceMentions(toReplace, content, type ="users") {
        let result,
            prefix,
            replace;
        if(type === "users") {
            prefix = "<@";
            replace = userReplace;
        } else if(type === "roles") {
            prefix = "<@&";
            replace = roleReplace;
        } else {
            return false;
        }
        for(let i = 0, len = users.length; i < len; i++) {
            let regex = new RegExp(prefix + users[i].id + ">", "g");

            result = content.replace(regex, replace);
        }
        return result;
    }
}