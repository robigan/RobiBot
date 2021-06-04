const BaseModel = require("../BaseModel.js");

module.exports = class guilds extends BaseModel {
    constructor(database) {
        super(database, "guilds");
        this.schema = new this.database.Mongoose.Schema({
            id: String,
            dataStore: Object,
            configStore: Object,
            _id: String
        }, {
            collection: this.name
        });
        this.schema.pre("save", async function() {
            this._id = this.id;
        });
        this.model = this.database.Mongoose.model(this.name, this.schema);
    }

    async init() {
        
    }
};