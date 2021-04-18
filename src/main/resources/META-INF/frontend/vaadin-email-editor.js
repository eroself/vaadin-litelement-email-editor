import { html, LitElement } from "lit-element";

class VaadinEmailEditor extends LitElement {

    constructor() {
        super();
        this.minHeight = 500;
        this.props = {};
        this.style = {};
        this.editorId = "email-editor";
    }

    static get properties() {
        return {
            editorId:String,
            minHeight:Number,
            style:Object,
            props:Object
        };
    }

    createRenderRoot() {
        return this;
    }

    firstUpdated(changedProperties) {
        // loadScript(this.loadEditor(this.props));
        this.loadLanguage('//editor.unlayer.com/embed.js?2').then(()=>this.loadEditor(), ()=>{console.log("failed")});
    }

    loadLanguage(scriptUrl) {
        let script = document.createElement('script');
        script.src = scriptUrl;
        document.head.appendChild(script);
        return new Promise((success, failed) => {
            script.onload = function() {
                success();
            }
            script.onerror = function () {
                failed();
            }
        });
    }

    loadEditor() {
        const options = this.props.options || {};

        if (this.props.projectId) {
            options.projectId = this.props.projectId;
        }

        if (this.props.tools) {
            options.tools = this.props.tools;
        }

        if (this.props.appearance) {
            options.appearance = this.props.appearance;
        }

        if (this.props.locale) {
            options.locale = this.props.locale;
        }

        this.editor = unlayer.createEditor({
            ...options,
            id: this.editorId,
            displayMode: 'email'
        });

        // All properties starting with on[Name] are registered as event listeners.
        for (const [key, value] of Object.entries(this.props)) {
            if (/^on/.test(key) && key !== 'onLoad') {
                this.addEventListener(key, value);
            }
        }

        const { onLoad } = this.props;
        onLoad && onLoad();
    };

    registerCallback(type, callback) {
        this.editor.registerCallback(type, callback);
    };

    addEventListener(type, callback) {
        this.editor.addEventListener(type, callback);
    };

    loadDesign(design) {
        this.editor.loadDesign(design);
    };

    saveDesign(callback) {
        this.editor.saveDesign(callback);
    };

    exportHtml(callback) {
        this.editor.exportHtml(callback);
    };

    setMergeTags(mergeTags) {
        this.editor.setMergeTags(mergeTags);
    };

    render() {
        return html`<div style='flex: 1; minHeight: ${this.minHeight}'>
        <div id="${this.editorId}" style="${this.style}" />
      </div>`;
    }

}

customElements.get('vaadin-email-editor') || customElements.define('vaadin-email-editor', VaadinEmailEditor);
