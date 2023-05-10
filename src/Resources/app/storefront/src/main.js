import quickViewVideoEvent from "./quickview-video-plugin/index";

const PluginManager = window.PluginManager;
PluginManager.register('QuickViewVideoPlugin',quickViewVideoEvent,'[select-video-button]');

