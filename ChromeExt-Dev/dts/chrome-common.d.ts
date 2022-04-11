declare global {
    type ChRSender = chrome.runtime.MessageSender;
    type ChSendResFn = (response: any) => void;
    type ChMsgListenerParams = [msg: any, sender: ChRSender, sendRes?: ChSendResFn];
}

export {}