export const KEY_BINDING_SECTIONS = [
  {
    heading: '标签页',
    bindings: {
      closeTab: { mac: 'command+bind+w', windows: 'ctrl+bind+w', name: '关闭标签页' }, // D
      closeAllTabs: { mac: 'command+bind+shift+bind+w', windows: 'ctrl+bind+shift+bind+w', name: '关闭所有标签页' }, // D
      save: { mac: 'command+bind+s', windows: 'ctrl+bind+s', name: '保存' }, // D
      saveAllTabs: { mac: 'command+bind+shift+bind+s', windows: 'ctrl+bind+shift+bind+s', name: '保存所有标签页' }, // D
      reopenLastClosedTab: { mac: 'command+bind+shift+bind+t', windows: 'ctrl+bind+shift+bind+t', name: '重新打开上次关闭的标签页' }, // D
      switchToTabAtPosition: { mac: 'command+bind+1+bind+command+bind+8', windows: 'ctrl+bind+1+bind+ctrl+bind+8', name: '切换到指定位置标签页', readOnly: true, displayValue: { mac: 'command+bind+1 - command+bind+8', windows: 'ctrl+bind+1 - ctrl+bind+8' } }, // D
      switchToLastTab: { mac: 'command+bind+9', windows: 'ctrl+bind+9', name: '切换到最后一个标签页' }, // D
      switchToPreviousTab: { mac: 'shift+bind+command+bind+[', windows: 'shift+bind+ctrl+bind+[', name: '切换到上一个标签页' }, // D
      switchToNextTab: { mac: 'shift+bind+command+bind+]', windows: 'shift+bind+ctrl+bind+]', name: '切换到下一个标签页' },
      moveTabLeft: { mac: 'command+bind+[', windows: 'ctrl+bind+[', name: '向左移动标签页' }, // D
      moveTabRight: { mac: 'command+bind+]', windows: 'ctrl+bind+]', name: '向右移动标签页' }, // D
      switchToTab1: { mac: 'command+bind+1', windows: 'ctrl+bind+1', name: '切换到指定位置标签页', readOnly: true, hidden: true },
      switchToTab2: { mac: 'command+bind+2', windows: 'ctrl+bind+2', name: '切换到指定位置标签页', readOnly: true, hidden: true },
      switchToTab3: { mac: 'command+bind+3', windows: 'ctrl+bind+3', name: '切换到指定位置标签页', readOnly: true, hidden: true },
      switchToTab4: { mac: 'command+bind+4', windows: 'ctrl+bind+4', name: '切换到指定位置标签页', readOnly: true, hidden: true },
      switchToTab5: { mac: 'command+bind+5', windows: 'ctrl+bind+5', name: '切换到指定位置标签页', readOnly: true, hidden: true },
      switchToTab6: { mac: 'command+bind+6', windows: 'ctrl+bind+6', name: '切换到指定位置标签页', readOnly: true, hidden: true },
      switchToTab7: { mac: 'command+bind+7', windows: 'ctrl+bind+7', name: '切换到指定位置标签页', readOnly: true, hidden: true },
      switchToTab8: { mac: 'command+bind+8', windows: 'ctrl+bind+8', name: '切换到指定位置标签页', readOnly: true, hidden: true }
    }
  },
  {
    heading: '侧边栏',
    bindings: {
      sidebarSearch: { mac: 'command+bind+f', windows: 'ctrl+bind+f', name: '在侧边栏中搜索' }, // D
      copyItem: { mac: 'command+bind+c', windows: 'ctrl+bind+c', name: '复制项目' }, // D
      pasteItem: { mac: 'command+bind+v', windows: 'ctrl+bind+v', name: '粘贴项目' }, // D
      cloneItem: { mac: 'command+bind+d', windows: 'ctrl+bind+d', name: '克隆项目' }, // D
      renameItem: { mac: 'command+bind+r', windows: 'ctrl+bind+r', name: '重命名项目' }, // D
      collapseSidebar: { mac: 'command+bind+\\', windows: 'ctrl+bind+\\', name: '折叠侧边栏' } // D
    }
  },
  {
    heading: '请求',
    bindings: {
      sendRequest: { mac: 'command+bind+enter', windows: 'ctrl+bind+enter', name: '发送请求' }, // D
      changeLayout: { mac: 'command+bind+j', windows: 'ctrl+bind+j', name: '切换布局方向' } // D
    }
  },
  {
    heading: '集合与环境',
    bindings: {
      importCollection: { mac: 'command+bind+o', windows: 'ctrl+bind+o', name: '导入集合' }, // D
      editEnvironment: { mac: 'command+bind+e', windows: 'ctrl+bind+e', name: '编辑环境' }, // D
      newRequest: { mac: 'command+bind+n', windows: 'ctrl+bind+n', name: '新建请求' } // D
    }
  },
  {
    heading: '搜索',
    bindings: {
      globalSearch: { mac: 'command+bind+k', windows: 'ctrl+bind+k', name: '全局搜索' } // D
    }
  },
  {
    heading: '视图',
    bindings: {
      zoomIn: { mac: 'command+bind+=', windows: 'ctrl+bind+=', name: '放大' },
      zoomOut: { mac: 'command+bind+-', windows: 'ctrl+bind+-', name: '缩小' },
      resetZoom: { mac: 'command+bind+0', windows: 'ctrl+bind+0', name: '重置缩放' }
    }
  },
  {
    heading: '开发者工具',
    bindings: {
      openTerminal: { mac: 'command+bind+t', windows: 'ctrl+bind+t', name: '在终端中打开' } // D
    }
  },
  {
    heading: '其他',
    bindings: {
      openPreferences: { mac: 'command+bind+,', windows: 'ctrl+bind+,', name: '打开偏好设置' }, // D
      closeBruno: { mac: 'command+bind+q', windows: 'ctrl+bind+shift+bind+q', name: '关闭 Bruno' } // D
    }
  }
];

export const KEY_BINDING_SEPARATOR = '+bind+';

export const MODIFIER_SYMBOLS = {
  mac: {
    command: '⌘',
    ctrl: '⌃',
    alt: '⌥',
    shift: '⇧'
  },
  windows: {
    ctrl: 'Ctrl',
    alt: 'Alt',
    shift: 'Shift',
    command: 'Win'
  }
};

export const fromKeysString = (keysStr) => (keysStr ? keysStr.split(KEY_BINDING_SEPARATOR).filter(Boolean) : []);

export const formatSingleKeyForDisplay = (key, os) => {
  if (MODIFIER_SYMBOLS[os]?.[key]) return MODIFIER_SYMBOLS[os][key];
  if (key.length === 1) return key.toUpperCase();

  const SPECIAL_LABELS = {
    enter: os === 'mac' ? '↩' : 'Enter',
    backspace: os === 'mac' ? '⌫' : 'Backspace',
    tab: os === 'mac' ? '⇥' : 'Tab',
    delete: os === 'mac' ? '⌦' : 'Delete',
    esc: os === 'mac' ? '⎋' : 'Esc',
    space: os === 'mac' ? '␣' : 'Space',
    arrowup: '↑',
    arrowdown: '↓',
    arrowleft: '←',
    arrowright: '→',
    pageup: 'PageUp',
    pagedown: 'PageDown',
    home: 'Home',
    end: 'End'
  };

  return SPECIAL_LABELS[key] || key.charAt(0).toUpperCase() + key.slice(1);
};

export const formatKeysForDisplay = (keysArr, os, separator = ' + ') => {
  if (!keysArr?.length) return '';
  return keysArr.map((key) => formatSingleKeyForDisplay(key, os)).join(separator);
};

export const getKeyBindingForActionByOS = (action, userKeyBindings, os) => {
  const merged = getMergedKeyBindings(userKeyBindings);
  return merged?.[action]?.[os] || '';
};

export const getKeyBindingDisplayTextByOS = (action, userKeyBindings, os) => {
  return formatKeysForDisplay(fromKeysString(getKeyBindingForActionByOS(action, userKeyBindings, os)), os);
};

/**
 * Converts keybindings from storage format (+bind+) to Mousetrap format (+)
 * Storage format uses +bind+ as separator to avoid conflicts with the actual + key
 * Mousetrap uses + as the separator
 * Also converts arrow key names to Mousetrap format
 *
 * @param {string} keysStr - Keybinding string in storage format
 * @returns {string|null} Keybinding string in Mousetrap format, or null if empty
 */
export const toMousetrapCombo = (keysStr) => {
  if (!keysStr) return null;

  // Split by +bind+ separator
  const parts = fromKeysString(keysStr);

  // Convert arrow key names from browser format to Mousetrap format
  const converted = parts.map((part) => {
    const lower = part.toLowerCase();
    if (lower === 'arrowup') return 'up';
    if (lower === 'arrowdown') return 'down';
    if (lower === 'arrowleft') return 'left';
    if (lower === 'arrowright') return 'right';
    return lower;
  });

  return converted.join('+');
};

/**
 * Merges default key bindings with user preferences.
 * Uses KEY_BINDING_SECTIONS as the source of truth for defaults.
 *
 * @param {Object} userKeyBindings - User's custom key bindings from preferences (preferences.keyBindings)
 * @returns {Object} Merged key bindings object
 */
export const getMergedKeyBindings = (userKeyBindings) => {
  const merged = {};

  // Start with defaults from KEY_BINDING_SECTIONS (source of truth)
  for (const section of KEY_BINDING_SECTIONS) {
    for (const [action, binding] of Object.entries(section.bindings || {})) {
      merged[action] = { ...binding };
    }
  }

  // Override with user preferences
  if (userKeyBindings && typeof userKeyBindings === 'object') {
    for (const [action, binding] of Object.entries(userKeyBindings)) {
      if (merged[action]) {
        merged[action] = {
          ...merged[action],
          ...binding
        };
      }
    }
  }

  return merged;
};

/**
 * Retrieves the Mousetrap-compatible key combos for a specific action across all operating systems.
 * Reads from merged defaults + user preferences.
 *
 * @param {string} action - The action for which to retrieve key bindings.
 * @param {Object} [userKeyBindings] - User's custom key bindings from preferences
 * @returns {string[]|null} Array of Mousetrap-compatible combo strings, or null if the action is not found.
 */
export const getKeyBindingsForActionAllOS = (action, userKeyBindings) => {
  const merged = getMergedKeyBindings(userKeyBindings);
  const actionBindings = merged[action];

  if (!actionBindings) {
    console.warn(`Action "${action}" not found in KeyMapping.`);
    return null;
  }

  const combos = [];

  // Detect current OS and use appropriate bindings only
  const isMac = navigator.platform.toLowerCase().includes('mac');

  if (isMac && actionBindings.mac) {
    const combo = toMousetrapCombo(actionBindings.mac);
    if (combo) combos.push(combo);
  } else if (!isMac && actionBindings.windows) {
    const combo = toMousetrapCombo(actionBindings.windows);
    if (combo) combos.push(combo);
  }

  // console.log('[keyMappings] getKeyBindingsForActionAllOS:', action, '->', combos);
  return combos.length > 0 ? combos : null;
};
