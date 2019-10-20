import MainDB from "../db/MainDB";
import { Tag } from '../../model/MainModel'

const mainDB = new MainDB()

const model = {
    dataSource: new Array<Tag>(),

    addTag(tag: Tag) {
        this.dataSource.push(tag)
        mainDB.addTag(tag)
    },

    fetchData() {
        if (this.dataSource.length === 0) {
            mainDB.fetchAllTags(tags => {
                this._init(tags)
            });
        }
    },

    _init(tags: Tag[]) {
        this.dataSource = tags
    }
};

export default model