import Utils from '../utils/Utils'

class Tag {
    public parentTagId: number 
    public childTagIds: number[] = []

    public id: number
    public name: string

    public isRoot: boolean = false

    public constructor(parentTagId: number, name: string) {
        this.parentTagId = parentTagId
        this.name = name

        this.id = Utils.generateId()
    }

    public toString() {
        
        return `${this.name}`
    }

    public addChild(childTagId: number) {
        this.childTagIds.push(childTagId)
    }

    public isSameTag(tag: Tag | undefined): boolean {
        

        if (tag === undefined) {
            return false
        } else {
            return this.id === tag.id
        }
    }

    /* ----------------------------------------------------------------------------------- */

    public static RootTag(): Tag {
        const root = new Tag(-1, "root")
        root.isRoot = true
        return root
    }

    public static restore(
        tagId: number,
        name: string,
        childTagIds: number[],
        isRoot: boolean
    ): Tag {
        const result = new Tag(-1, name)

        result.id = tagId
        result.childTagIds = childTagIds
        result.isRoot = isRoot

        return result
    }
}

class Note {
    
    
    public tagIds: number[] = []
    public id: number
    public title: string = ""
    public path: string 

    public createTime: number
    public lastModifyTime: number

    
    
    public constructor(path: string) {
        this.path = path;

        this.createTime = new Date().getTime();
        this.lastModifyTime = this.createTime;

        this.id = Utils.generateId()
    }

    toString() {
        
        return `${this.id}-${this.title}`
        
    }

    addTag(tagId: number) {
        this.tagIds.push(tagId);
    }

    updateTitle(title: string) {
        this.title = title;
    }

    public isSameNote(note: Note | undefined): boolean {
        

        if (note === undefined) {
            return false
        } else {
            return this.id === note.id
        }
    }

    /* ----------------------------------------------------------------------------------- */

    public static restore(
        id: number,
        title: string,
        path: string,
        createTime: number,
        lastModifyTime: number,
    ): Note {
        const result = new Note(path)

        result.id = id
        result.title = title
        result.createTime = createTime
        result.lastModifyTime = lastModifyTime

        return result
    }
}

class RecentNote {
    public dbId?: number

    public note: Note
    public isTop:boolean = false
    public topTime:number = -1
    
    public constructor(note: Note) {
        this.note = note;
    }

    toString() {
        return `${this.note.toString()}`
    }

    public setTop(){
        this.isTop = true
        this.topTime = Utils.getCurrentTimeMs()
    }

    public cancelTop() {
        this.isTop = false
        this.topTime = -1
    }

    /* ----------------------------------------------------------------------------------- */

    public static restore(
        dbId: number,
        note: Note,
        isTop:boolean,
        topTime:number,
    ): RecentNote {
        const result = new RecentNote(note)

        result.dbId = dbId
        result.isTop = isTop
        result.topTime = topTime

        return result
    }
}

export { Tag, Note, RecentNote }