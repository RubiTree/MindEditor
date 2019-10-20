import Dexie from 'dexie';
import { Tag, Note, RecentNote } from '../../model/MainModel'

interface ItemTag {
    id?: number

    tagId: number
    name: string
    childTagIds: number[]
    isRoot: boolean
}
interface ItemNote {
    id?: number

    noteId: number
    title: string
    path: string
    createTime: number
    lastModifyTime: number
}
interface ItemTagNote {
    id?: number

    tagId: number
    noteId: number
}
interface ItemRecentNote {
    id?: number

    noteId: number
    isTop: boolean
    topTime: number
}

class MainDB extends Dexie {
    public tags: Dexie.Table<ItemTag, number>;
    public notes: Dexie.Table<ItemNote, number>;
    public tagNotes: Dexie.Table<ItemTagNote, number>;
    public recentNotes: Dexie.Table<ItemRecentNote, number>;

    public constructor() {
        super("MainDB");

        this.version(1).stores({
            tags: "++id,tagId,name,childTagIds,isRoot",
            notes: "++id,noteId,title,path,createTime,lastModifyTime",
            tagNotes: "++id,tagId,noteId",
            recentNotes: "++id,noteId,isTop,topTime",
        });
        this.tags = this.table("tags");
        this.notes = this.table("notes");
        this.tagNotes = this.table("tagNotes");
        this.recentNotes = this.table("recentNotes");
    }

    /* ----------------------------------------------------------------------------------- */

    public addTag(tag: Tag) {
        this.transaction('rw', this.tags, async () => {
            await this.tags.add({ tagId: tag.id, name: tag.name, childTagIds: tag.childTagIds, isRoot: tag.isRoot });
        }).catch(e => {
            alert(e.stack || e);
        });
    }

    public fetchAllTags(callback: (tags: Tag[]) => void) {
        this.transaction('rw', this.tags, async () => {
            const dbTags = await this.tags.toArray();
            callback(dbTags.map(value => Tag.restore(value.tagId, value.name, value.childTagIds, value.isRoot)))
        }).catch(e => {
            alert(e.stack || e);
        });
    }

    /* ----------------------------------------------------------------------------------- */

    public addNote(note: Note) {
        this.transaction('rw', this.notes, this.tagNotes, async () => {
            this.notes.add({ noteId: note.id, title: note.title, path: note.path, createTime: note.createTime, lastModifyTime: note.lastModifyTime });

            this.tagNotes.add({ tagId: note.tagIds[0], noteId: note.id })
        }).catch(e => {
            alert(e.stack || e);
        });
    }

    public getNotesByTagId(tagId: number, callback: (notes: Note[]) => void) {
        this.transaction('rw', this.notes, this.tagNotes, async () => {
            const tagNoteItems = await this.tagNotes.where('tagId').equals(tagId).toArray();
            const noteIds = tagNoteItems.map(value => value.noteId)
            const noteItems = await this.notes.where('noteId').anyOf(noteIds).toArray()
            callback(noteItems.map(value => this.itemNote2Note(value)))
        }).catch(e => {
            alert(e.stack || e);
        });
    }

    private itemNote2Note(itemNote: ItemNote): Note {
        return Note.restore(itemNote.noteId, itemNote.title, itemNote.path, itemNote.createTime, itemNote.lastModifyTime)
    }

    /* ----------------------------------------------------------------------------------- */

    public addRecentNote(note: RecentNote) {
        this.transaction('rw', this.recentNotes, async () => {
            const id = await this.recentNotes.add({ noteId: note.note.id, isTop: note.isTop, topTime: note.topTime });
            note.dbId = id
        }).catch(e => {
            alert(e.stack || e);
        });
    }

    public fetchAllRecentNotes(callback: (recentNotes: RecentNote[], topSize: number) => void) {
        this.transaction('rw', this.notes, this.recentNotes, async () => {
            const recentNoteItems = await this.recentNotes.toArray();


            const recentTopNotes: RecentNote[] = []
            const recentNormalNotes: RecentNote[] = []
            for (let i = 0; i < recentNoteItems.length; i++) {
                const recentNoteItem = recentNoteItems[i];
                if (recentNoteItem.id) {
                    const tempNotes = await this.notes.where('noteId').equals(recentNoteItem.noteId).toArray()

                    if (tempNotes.length > 0 && tempNotes[0]) {
                        const note = this.itemNote2Note(tempNotes[0])
                        const recentNote = RecentNote.restore(recentNoteItem.id, note, recentNoteItem.isTop, recentNoteItem.topTime);

                        if (recentNote.isTop) {
                            recentTopNotes.unshift(recentNote)
                        } else {
                            recentNormalNotes.unshift(recentNote)
                        }
                    }
                } else {
                }
            }

            recentTopNotes.sort((a, b) => b.topTime - a.topTime)
            callback(recentTopNotes.concat(recentNormalNotes), recentTopNotes.length)


        }).catch(e => {
            alert(e.stack || e);
        });
    }

    public updateTop(note: RecentNote) {
        if (note.dbId === undefined) {
            console.log("DB RecentNote 没有 dbId")
            return
        }

        this.transaction('rw', this.recentNotes, async () => {
            this.recentNotes.update(note.dbId!, { isTop: note.isTop, topTime: note.topTime })
        }).catch(e => {
            alert(e.stack || e);
        });
    }
}

export default MainDB