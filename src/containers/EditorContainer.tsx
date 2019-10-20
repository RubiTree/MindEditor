import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { Input, message, Button } from 'antd';
import stores from '../store/store';
import { Note } from '../model/MainModel'
import { CurrentNoteKey } from '../store/store/CurrentNoteStore';
import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";
import Utils from '../utils/Utils';
import fileHelper from '../utils/FileHelper'

const Container = styled.div`
  background: #ffffff;
  display: flex;
  height: 100%;
  flex-direction: column;
`

const Editor = styled(SimpleMDE)`
  flex-grow: 1;
`

const ButtonGroup = styled(Button.Group)`
margin: 2px;
`

const EditorContainer: React.FC = () => {
  const { currentNote } = stores.useStore(CurrentNoteKey) as { currentNote: Note | undefined }

  const [content, setContent] = useState("")

  /* ---------------------------初始化------------------------------- */

  const editorRef = React.useRef(null)

  useEffect(() => {


    const $codeMirror = document.querySelector('.CodeMirror');
    const editorDom = editorRef.current as HTMLElement | null

    if ($codeMirror && editorDom) {
      $codeMirror.setAttribute('style', 'height:' + (editorDom.clientHeight - 62) + 'px;box-shadow:none');
    }
  })

  const [lastNote, setLastNote] = useState<Note | undefined>(undefined)
  useEffect(() => {
    console.log(`Current content:${content}`)
    if (currentNote === undefined) return

    if (!currentNote.isSameNote(lastNote)) {
      setLastNote(currentNote)

      fileHelper.readNote(currentNote, (isError, contentOrErrorMsg) => {
        if (isError) {
          message.error(contentOrErrorMsg)
          setContent(contentOrErrorMsg)
        } else {
          setContent(contentOrErrorMsg)
        }
      })
    }
  })

  /* ----------------------------保存Note文本------------------------------ */

  const [isOnSave, setIsOnSave] = useState(false)
  
  function updateContent(content: string) {
    setContent(content)
  }

  function saveToLocal(event: any, isManual: boolean) {
    if (event) event.preventDefault();
    if (currentNote === undefined) return
    if (isOnSave) return
    setIsOnSave(true)

    fileHelper.saveNote(currentNote, content, (isSuccess) => {
      setIsOnSave(false)
      if (isSuccess) {
        if (isManual) message.info("已保存")
      } else {
        message.error("保存失败")
      }
    })
  }

  /* ---------------------------保存图片------------------------------- */

  function handGetImage(file: File, onSuccess: (url: string) => void, onError: (error: string) => void) {
    fileHelper.saveImage(file, (isSuccess, formatPathOrErrorMsg) => {
      if (isSuccess) {
        onSuccess(formatPathOrErrorMsg)
      } else {
        message.error(formatPathOrErrorMsg)
        onError(formatPathOrErrorMsg)
      }
    })
  }

  /* ---------------------------------------------------------- */

  return (
    <Container
      ref={editorRef}>

      <ButtonGroup>
        <Button type="primary" size="small" onClick={(e) => saveToLocal(e, true)}>Save</Button>
        <Button type="primary" size="small" onClick={fileHelper.openDir}>Open</Button>
      </ButtonGroup>


      <Editor
        key={currentNote && currentNote.id}
        value={content}
        onChange={updateContent}
        options={{
          spellChecker: false,
          toolbar: false,
          hideIcons: ["side-by-side", "guide"],
          uploadImage: true,
          imageUploadFunction: handGetImage,
          imageAccept: "image/jpeg"
        }}

      />
    </Container>
  );
}

export default EditorContainer;