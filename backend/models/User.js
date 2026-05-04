const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

// Always resolve relative to this file's location
const DB_FILE = path.resolve(__dirname, '..', 'data', 'users.json');

const ensureDB = () => {
    const dir = path.dirname(DB_FILE);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
    if (!fs.existsSync(DB_FILE)) {
        fs.writeFileSync(DB_FILE, '[]', 'utf8');
    }
};

const readUsers = () => {
    ensureDB();
    try {
        const raw = fs.readFileSync(DB_FILE, 'utf8').trim();
        return raw ? JSON.parse(raw) : [];
    } catch (e) {
        console.error('[User] Failed to read users.json:', e.message);
        return [];
    }
};

const writeUsers = (users) => {
    ensureDB();
    try {
        fs.writeFileSync(DB_FILE, JSON.stringify(users, null, 2), 'utf8');
        console.log(`[User] Saved ${users.length} user(s) to ${DB_FILE}`);
    } catch (e) {
        console.error('[User] Failed to write users.json:', e.message);
        throw e;
    }
};

class User {
    constructor(data) {
        this._id = data._id;
        this.name = data.name;
        this.email = data.email;
        this.password = data.password;
        this.role = data.role || 'farmer';
        this.createdAt = data.createdAt || new Date().toISOString();
    }

    async matchPassword(enteredPassword) {
        return await bcrypt.compare(enteredPassword, this.password);
    }

    static async create(data) {
        const users = readUsers();
        if (users.find(u => u.email === data.email)) {
            throw new Error('Email already exists');
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash(data.password, salt);
        const newUser = {
            _id: String(Date.now()),
            name: data.name,
            email: data.email,
            password: hashedPass,
            role: data.role || 'farmer',
            createdAt: new Date().toISOString()
        };
        users.push(newUser);
        writeUsers(users);
        return new User(newUser);
    }

    static findOne(query) {
        return {
            select: async () => {
                const users = readUsers();
                const found = users.find(u => u.email === query.email);
                return found ? new User(found) : null;
            }
        };
    }

    static async findById(id) {
        const users = readUsers();
        const found = users.find(u => u._id === String(id));
        return found ? new User(found) : null;
    }
}

module.exports = User;
