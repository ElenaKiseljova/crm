
export default {
  install: (app) => {
    app.config.globalProperties.$message = (html) => {
      return window.M.toast({ html, classes: 'message-success' });
    };

    app.config.globalProperties.$error = (html) => {
      return window.M.toast({ html: `Ошибка: ${html}`, classes: 'message-error' });
    };

    app.provide('message', app.config.globalProperties.$message);
    app.provide('error', app.config.globalProperties.$error);
  }
}