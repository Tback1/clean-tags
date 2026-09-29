const { Plugin } = require('obsidian');

class CleanTagsPlugin extends Plugin {
    onload() {
        console.log("🟢 [CleanTags] 插件已加载，开始常驻标签突变监听。");

        this.observer = new MutationObserver(() => {
            // 阅读模式标签重构
            document.querySelectorAll('a[href^="#"].tag:not(.my-tag-ready)').forEach(el => {
                const rawText = el.textContent;
                if (rawText.startsWith('#')) {
                    const cleanText = rawText.replace(/^#+/, '');
                    el.innerHTML = `<span class="my-tag-hash">#</span><span class="my-tag-text">${cleanText}</span>`;
                    el.classList.add('my-tag-ready', 'my-tag-box');
                }
            });

            // 编辑模式标签重构
            document.querySelectorAll('.cm-hashtag-begin:not(.my-tag-hash)').forEach(el => {
                el.classList.add('my-tag-hash');
            });
            document.querySelectorAll('.cm-hashtag-end:not(.my-tag-text)').forEach(el => {
                el.classList.add('my-tag-text', 'my-tag-box');
            });
        });

        this.observer.observe(document.body, { childList: true, subtree: true });
    }

    onunload() {
        if (this.observer) {
            this.observer.disconnect();
            console.log("🔴 [CleanTags] 插件已卸载，MutationObserver 已安全断开。");
        }
    }
}

// 必须使用 module.exports 导出类本身，而不是实例
module.exports = CleanTagsPlugin;