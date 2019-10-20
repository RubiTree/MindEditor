import { Note } from '../../model/MainModel'

const CurrentNoteKey = "CurrentNoteKey"

const currentNoteStore = {
    currentNote: undefined as Note|undefined,

    setCurrentNote(note: Note) {
        this.currentNote = note
    },
};

export {CurrentNoteKey, currentNoteStore}