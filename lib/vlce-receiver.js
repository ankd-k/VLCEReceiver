'use babel';

import VlceReceiverView from './vlce-receiver-view';
import { CompositeDisposable } from 'atom';

import { Server } from 'node-osc';

export default {

  vlceReceiverView: null,
  modalPanel: null,
  subscriptions: null,

  defaultIP: null,
  defaultPort: null,

  activate(state) {
    this.vlceReceiverView = new VlceReceiverView(state.vlceReceiverViewState);
    this.modalPanel = atom.workspace.addModalPanel({
      item: this.vlceReceiverView.getElement(),
      visible: false
    });
    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'vlce-receiver:toggle': () => this.toggle()
    }));

    this.defaultIP = '127.0.0.1',
    this.defaultPort = 9000,
    this.server = new Server(this.defaultPort, this.defaultIP);
    this.server.on('/text', function (msg) {
      atom.workspace.observeTextEditors(editor => {
        editor.setText(msg[1]);
      });
    });
    console.log('actiavte is done.');
  },

  deactivate() {
    this.modalPanel.destroy();
    this.subscriptions.dispose();
    this.vlceReceiverView.destroy();
  },

  serialize() {
    return {
      vlceReceiverViewState: this.vlceReceiverView.serialize()
    };
  },

  toggle() {
    console.log('VlceReceiver was toggled!');
    return (
      this.modalPanel.isVisible() ?
      this.modalPanel.hide() :
      this.modalPanel.show()
    );
  }

};
