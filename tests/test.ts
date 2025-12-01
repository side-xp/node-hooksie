import Hooksie from '../dist/index';

const scope = Hooksie.scope('demoScope');

const sendInfoHook = scope.hook<string>('sendInfo');
const updateScoreHook = scope.hook<number>('updateScore');

function handleSendInfo(info: string) {
  console.log('HANDLE SEND INFO:', info);
}

function handleUpdateScore(info: number) {
  console.log('HANDLE UPDATE SCORE:', info);
}

const sendInfoHandle = sendInfoHook.fasten(handleSendInfo);
updateScoreHook.fasten(handleUpdateScore);

sendInfoHook.invoke('info');
updateScoreHook.invoke(100);

sendInfoHandle.detach();
updateScoreHook.detach(handleUpdateScore);