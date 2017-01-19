define("src/hephaistos/js/common/main-debug", ["bui/menu-debug", "bui/tab-debug"], function(require) {
    function setTopManager(mainPageObj) {
        window.topManager = mainPageObj
    }

    function addSearch(href, search) {
        return href.indexOf("?") !== -1 ? href + "&" + search : href + "?" + search
    }

    function tabNav(moduleId, tabConfig, menuConfig, collapsed, homePage) {
        var _self = this,
            menu = new Menu.SideMenu(menuConfig),
            tab = new Tab.NavTab(tabConfig),
            menuContainerEl = $(menuConfig.render),
            slibEl = menuContainerEl.next("." + CLS_LEFT_SLIB + "-con"),
            navContainerEl = menuContainerEl.parents("." + CLS_TAB_ITEM);
        slibEl && (slibEl.on("click", function() {
            navContainerEl.toggleClass(CLS_CALLAPSE)
        }), slibEl.parent().height(tabConfig.height)), collapsed && navContainerEl.addClass(CLS_CALLAPSE), menu.on("menuclick", function(ev) {
            var item = ev.item;
            item && _self.tab.addTab({
                id: item.get("id"),
                title: item.get("text"),
                href: item.get("href"),
                closeable: item.get("closeable")
            }, !0)
        }), menu.on("itemselected", function(ev) {
            var item = ev.item;
            item && setNavPosition(moduleId, item.get("id"))
        }), tab.on("activeChange", function(ev) {
            var item = ev.item;
            item ? _self.menu.setSelectedByField(item.get("id")) : _self.menu.clearSelection()
        }), _self.tab = tab, _self.menu = menu, _self.homePage = homePage, tab.render(), menu.render()
    }

    function setNavPosition(moduleId, pageId) {
        pageId = pageId || "";
        var str = "#" + moduleId;
        pageId && (str += "/" + pageId), location.hash = str
    }

    function getNavPositionSetting() {
        var pos = location.hash,
            moduleIndex = 0,
            pageId = "",
            splitIndex = pos.indexOf("/"),
            search = null;
        return pos ? (splitIndex >= 0 ? (moduleIndex = pos.substring(1, splitIndex), pageId = pos.substring(splitIndex + 1), search = getParam(pageId), search && (pageId = pageId.replace("?" + search, ""))) : moduleIndex = pos.substring(1), {
            moduleId: moduleIndex,
            pageId: pageId,
            search: search
        }) : null
    }

    function getParam(pageId) {
        var index = pageId.indexOf("?");
        return index >= 0 ? pageId.substring(index + 1) : null
    }

    function initModuleConfig(mconfig) {
        if ($.isArray(mconfig)) {
            for (var emptyIndex = findEmptyIndex(mconfig); emptyIndex !== -1;) mconfig.splice(emptyIndex, 1), emptyIndex = findEmptyIndex(mconfig);
            return mconfig
        }
    }

    function findEmptyIndex(array) {
        var result = -1;
        return $.each(array, function(index, item) {
            if (null === item || void 0 === item) return result = index, !1
        }), result
    }

    function getAutoHeight() {
        var height = BUI.viewportHeight(),
            subHeight = 70;
        return height - subHeight
    }

    function findItem(element) {
        var el = $(element);
        return el.hasClass(CLS_ITEM) ? element : el.parent("." + CLS_ITEM)[0]
    }
    var PageUtil = BUI.app("PageUtil"),
        Menu = require("bui/menu-debug"),
        Tab = require("bui/tab-debug"),
        CLS_SELECTE = "dl-selected",
        CLS_HIDDEN = "ks-hidden",
        CLS_LAST = "dl-last",
        CLS_HOVER = "dl-hover",
        CLS_ITEM = "nav-item",
        CLS_LEFT_SLIB = "dl-second-slib",
        CLS_TAB_ITEM = "dl-tab-item",
        CLS_CALLAPSE = "dl-collapse",
        CLS_HIDE_CURRENT = "dl-hide-current",
        ATTTR_INDEX = "data-index",
        WIDTH_ITERM = 145,
        mainPage = function(config) {
            initModuleConfig(config), mainPage.superclass.constructor.call(this, config), this._init(), setTopManager(this)
        };
    return mainPage.ATTRS = {
        currentModelIndex: {},
        hideItmes: {
            value: []
        },
        hideList: {},
        modules: {
            value: []
        },
        modulesConfig: {},
        navList: {
            valueFn: function() {
                return $("#J_Nav")
            }
        },
        navContent: {
            valueFn: function() {
                return $("#J_NavContent")
            }
        },
        navItems: {
            valueFn: function() {
                return $("#J_Nav").children("." + CLS_ITEM)
            }
        },
        navTabs: {
            valueFn: function() {
                return this.get("navContent").children("." + CLS_TAB_ITEM)
            }
        },
        urlSuffix: {
            value: ".html"
        }
    }, BUI.extend(mainPage, BUI.Base), BUI.augment(mainPage, {
        openPage: function(pageInfo) {
            var _self = this,
                moduleId = pageInfo.moduleId || _self._getCurrentModuleId(),
                id = pageInfo.id,
                title = pageInfo.title || "新的标签页",
                href = pageInfo.href,
                isClose = pageInfo.isClose,
                closeable = pageInfo.closeable,
                reload = pageInfo.reload,
                search = pageInfo.search,
                module = _self._getModule(moduleId);
            if (module) {
                var tab = module.tab,
                    menu = module.menu,
                    menuItem = menu.getItem(id),
                    curTabPage = tab.getActivedItem(),
                    sourceId = curTabPage ? curTabPage.get("id") : null,
                    moduleIndex = _self._getModuleIndex(moduleId);
                moduleId != _self._getCurrentModuleId() && _self._setModuleSelected(moduleIndex), menuItem ? _self._setPageSelected(moduleIndex, id, reload, search) : tab.addTab({
                    id: id,
                    title: title,
                    href: href,
                    sourceId: sourceId,
                    closeable: closeable
                }, reload), isClose && curTabPage.close()
            }
        },
        closePage: function(id, moduleId) {
            this.operatePage(moduleId, id, "close")
        },
        reloadPage: function(id, moduleId) {
            this.operatePage(moduleId, id, "reload")
        },
        setPageTitle: function(title, id, moduleId) {
            this.operatePage(moduleId, id, "setTitle", [title])
        },
        operatePage: function(moduleId, id, action, args) {
            moduleId = moduleId || this._getCurrentModuleId(), args = args || [];
            var _self = this,
                module = _self._getModule(moduleId);
            if (module) {
                var tab = module.tab,
                    item = id ? tab.getItemById(id) : tab.getActivedItem();
                item && item[action] && item[action].apply(item, args)
            }
        },
        _createModule: function(id) {
            var _self = this,
                item = _self._getModuleConfig(id),
                modules = _self.get("modules");
            if (!item) return null;
            var id = item.id,
                tabId = "#J_" + id + "Tab",
                treeId = "#J_" + id + "Tree";
            return module = new tabNav(id, {
                render: tabId,
                height: getAutoHeight() - 5
            }, {
                render: treeId,
                items: item.menu,
                height: getAutoHeight() - 5
            }, item.collapsed, item.homePage), modules[id] = module, module
        },
        _hideHideList: function() {
            this.get("hideList").hide()
        },
        _init: function() {
            var _self = this;
            _self._initDom(), _self._initNavItems(), _self._initEvent()
        },
        _initNavItems: function() {
            var _self = this,
                navItems = _self.get("navItems"),
                hideItmes = _self.get("hideItmes");
            if (0 !== navItems.length) {
                $('<div class="nav-item-mask"></div>').appendTo($(navItems));
                var count = navItems.length,
                    clientWidth = BUI.viewportWidth(),
                    itemWidth = WIDTH_ITERM,
                    totalWidth = itemWidth * count,
                    showCount = 0;
                if (!(totalWidth <= clientWidth)) {
                    $.each(navItems, function(index, item) {
                        $(item).attr(ATTTR_INDEX, index), $(item).removeClass(CLS_LAST)
                    }), showCount = parseInt(clientWidth / itemWidth);
                    var lastShowItem = navItems[showCount - 1];
                    _self._setLastItem(lastShowItem), hideItmes.push($(lastShowItem).clone()[0]);
                    for (var i = showCount; i < count; i++) {
                        var itemEl = $(navItems[i]),
                            cloneItme = null;
                        cloneItme = itemEl.clone()[0], hideItmes.push(cloneItme), itemEl.addClass(CLS_HIDDEN)
                    }
                    _self._initHideList()
                }
            }
        },
        _initHideList: function() {
            var _self = this,
                hideList = _self.get("hideList"),
                hideItmes = _self.get("hideItmes");
            if (!hideList) {
                var template = '<ul class="dl-hide-list ks-hidden"></ul>',
                    hideListEl = $(template).appendTo("body");
                hideList = hideListEl, $.each(hideItmes, function(index, item) {
                    $(item).appendTo(hideList)
                }), _self.set("hideList", hideList), _self._initHideListEvent()
            }
        },
        _initHideListEvent: function() {
            var _self = this,
                hideList = _self.get("hideList");
            null != hideList && (hideList.on("mouseleave", function() {
                _self._hideHideList()
            }), hideList.on("click", function(event) {
                var item = findItem(event.target),
                    el = null,
                    dataIndex = 0;
                item && (el = $(item), dataIndex = el.attr(ATTTR_INDEX), _self._setModuleSelected(dataIndex), _self._hideHideList())
            }))
        },
        _initContents: function() {
            var _self = this,
                modulesConfig = _self.get("modulesConfig"),
                navContent = _self.get("navContent");
            navContent.children().remove(), $.each(modulesConfig, function(index, module) {
                var id = module.id,
                    temp = ['<li class="dl-tab-item ks-hidden"><div class="dl-second-nav"><div class="dl-second-tree" id="J_', id, 'Tree"></div><div class="', CLS_LEFT_SLIB, '-con"><div class="', CLS_LEFT_SLIB, '"></div></div></div><div class="dl-inner-tab" id="J_', id, 'Tab"></div></li>'].join("");
                new $(temp).appendTo(navContent)
            })
        },
        _initDom: function() {
            var _self = this;
            _self._initContents(), _self._initLocation()
        },
        _initEvent: function() {
            var _self = this,
                navItems = _self.get("navItems");
            navItems.each(function(index, item) {
                var item = $(item);
                item.on("click", function() {
                    var sender = $(this);
                    sender.hasClass(CLS_SELECTE) || _self._setModuleSelected(index, sender)
                }).on("mouseenter", function() {
                    $(this).addClass(CLS_HOVER)
                }).on("mouseleave", function() {
                    $(this).removeClass(CLS_HOVER)
                })
            }), _self._initNavListEvent()
        },
        _initNavListEvent: function() {
            var _self = this,
                hideList = _self.get("hideList"),
                navList = _self.get("navList");
            navList.on("mouseover", function(event) {
                var item = findItem(event.target),
                    el = $(item),
                    offset = null;
                el && el.hasClass(CLS_LAST) && hideList && (offset = el.offset(), offset.top += 37, offset.left += 2, _self._showHideList(offset))
            }).on("mouseout", function(event) {
                var toElement = event.toElement;
                toElement && hideList && !$.contains(hideList[0], toElement) && toElement !== hideList[0] && _self._hideHideList()
            })
        },
        _initLocation: function() {
            var _self = this,
                defaultSetting = getNavPositionSetting();
            if (defaultSetting) {
                var pageId = defaultSetting.pageId,
                    search = defaultSetting.search,
                    index = _self._getModuleIndex(defaultSetting.moduleId);
                _self._setModuleSelected(index), _self._setPageSelected(index, pageId, !0, search)
            } else {
                var currentModelIndex = _self.get("currentModelIndex"),
                    moduleId = _self._getModuleId(currentModelIndex);
                null == currentModelIndex ? _self._setModuleSelected(0) : setNavPosition(moduleId)
            }
        },
        _getModule: function(id) {
            var _self = this,
                module = _self.get("modules")[id];
            return module || (module = _self._createModule(id)), module
        },
        _getModuleIndex: function(id) {
            var _self = this,
                result = 0;
            return $.each(_self.get("modulesConfig"), function(index, conf) {
                if (conf.id === id) return result = index, !1
            }), result
        },
        _getModuleConfig: function(id) {
            var _self = this,
                result = null;
            return $.each(_self.get("modulesConfig"), function(index, conf) {
                if (conf.id === id) return result = conf, !1
            }), result
        },
        _getModuleId: function(index) {
            var modulesConfig = this.get("modulesConfig");
            return modulesConfig[index] ? modulesConfig[index].id : index
        },
        _getCurrentPageId: function() {
            var _self = this,
                moduleId = _self._getCurrentModuleId(),
                module = _self._getModule(moduleId),
                pageId = "";
            if (module) {
                var item = module.menu.getSelected();
                item && (pageId = item.get("id"))
            }
            return pageId
        },
        _getCurrentModuleId: function() {
            return this._getModuleId(this.get("currentModelIndex"))
        },
        _isModuleInitial: function(id) {
            return !!this.get("modules")[id]
        },
        _setLastItem: function(item) {
            var _self = this,
                lastShowItem = _self.get("lastShowItem");
            if (lastShowItem !== item) {
                var appendNode = null,
                    lastShowItemEl = $(lastShowItem);
                itemEl = $(item), lastShowItem && (appendNode = lastShowItemEl.find("." + CLS_HIDE_CURRENT), lastShowItemEl.removeClass(CLS_LAST), lastShowItemEl.addClass(CLS_HIDDEN)), itemEl.addClass(CLS_LAST), itemEl.removeClass(CLS_HIDDEN), appendNode || (appendNode = $('<span class="icon icon-white  icon-caret-down ' + CLS_HIDE_CURRENT + '">&nbsp;&nbsp;</span>')), appendNode.appendTo(itemEl.children(".nav-item-inner")), _self.set("lastShowItem", item)
            }
        },
        _setModuleSelected: function(index, sender) {
            var _self = this,
                navItems = _self.get("navItems"),
                navTabs = _self.get("navTabs"),
                currentModelIndex = _self.get("currentModelIndex");
            if (currentModelIndex !== index) {
                var moduleId = _self._getModuleId(index),
                    module = null,
                    lastShowItem = _self.get("lastShowItem"),
                    isCreated = !0;
                _self._isModuleInitial(moduleId) || (isCreated = !1), module = _self._getModule(moduleId), sender = sender || $(_self.get("navItems")[index]), sender.hasClass(CLS_HIDDEN) && lastShowItem && (_self._setLastItem(sender[0]), _self._setSelectHideItem(index)), navItems.removeClass(CLS_SELECTE), sender.addClass(CLS_SELECTE), navTabs.addClass(CLS_HIDDEN), $(navTabs[index]).removeClass(CLS_HIDDEN), currentModelIndex = index, _self.set("currentModelIndex", currentModelIndex), curPageId = _self._getCurrentPageId(), setNavPosition(moduleId, curPageId), !curPageId && module.homePage && _self._setPageSelected(index, module.homePage)
            }
        },
        _setPageSelected: function(moduleIndex, pageId, isReload, search) {
            var _self = this,
                moduleId = _self._getModuleId(moduleIndex) || moduleIndex,
                module = _self._getModule(moduleId);
            if (module && pageId) {
                module.menu.setSelectedByField(pageId);
                var item = module.menu.getSelected(),
                    tab = module.tab,
                    href = "",
                    suffixIndex = -1;
                if (item && item.get("id") === pageId) href = item.get("href"), href = search ? addSearch(href, search) : href, module.tab.addTab({
                    id: item.get("id"),
                    title: item.get("text"),
                    closeable: item.get("closeable"),
                    href: href
                }, !!isReload);
                else if (pageId) {
                    var subDir = pageId.replace("-", "/");
                    subDir.indexOf("/") === -1 && (subDir = moduleId + "/" + subDir), (suffixIndex = pageId.indexOf(".")) === -1 && (subDir += _self.get("urlSuffix")), href = search ? subDir + "?" + search : subDir, tab.addTab({
                        id: pageId,
                        title: "",
                        href: href
                    }, !!isReload)
                }
            }
        },
        _showHideList: function(offset) {
            var _self = this,
                hideList = _self.get("hideList");
            hideList.css("left", offset.left), hideList.css("top", offset.top), hideList.show()
        },
        _setSelectHideItem: function(index) {
            var _self = this,
                hideList = _self.get("hideList"),
                hideItmes = _self.get("hideItmes"),
                currentItem = null,
                selectItem = null,
                selectEl = null,
                appendNode = null;
            BUI.each(hideItmes, function(item) {
                var itemEl = $(item);
                itemEl.attr(ATTTR_INDEX) == index && (selectItem = item), itemEl.hasClass(CLS_LAST) && (currentItem = item)
            }), currentItem !== selectItem && (currentItem && (appendNode = $(currentItem).find(".dl-hide-current"), $(currentItem).removeClass(CLS_LAST)), $(selectItem).addClass(CLS_LAST), appendNode || (appendNode = new Node('<span class="dl-hide-current">&nbsp;&nbsp;</span>')), selectEl = $(selectItem), appendNode.appendTo(selectEl.children(".nav-item-inner")), selectEl.prependTo(hideList))
        }
    }), PageUtil.MainPage = mainPage, mainPage
});