
import Store from '@ice/store';
import mainmodel from './MainStore';
import {CurrentNoteKey, currentNoteStore} from './CurrentNoteStore';

const storeManager = new Store();

//  *（@@@？todo 使用常量 mainmodel？）* 
storeManager.registerStore('mainmodel', mainmodel);
storeManager.registerStore(CurrentNoteKey, currentNoteStore);

export default storeManager;