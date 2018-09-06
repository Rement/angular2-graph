import { TreeDiagramNodesList } from './nodesList.class';

export class TreeDiagramNode {
    public isMaker = true;
    public parentId: string | null;
    public guid: string;
    public width: number;
    public height: number;
    public isDragover: boolean;
    public isDragging: boolean;
    public children: Set<string>;
    public displayName: string;
    public status: string;
    private _toggle: boolean;

    constructor(props, config, public getThisNodeList: () => TreeDiagramNodesList) {
        if (!props.guid) {
            return;
        }
        for (const prop in props) {
            if (props.hasOwnProperty(prop)) {
                this[prop] = props[prop];
            }
        }

        this._toggle = true;
        this.status = props.status;

        if (config.nodeWidth) {
            this.width = config.nodeWidth;
        }
        if (config.nodeHeight) {
            this.height = config.nodeHeight;
        }
        this.children = new Set(props.children as string[]);
    }

    public destroy() {
        this.getThisNodeList().destroy(this.guid);
    }

    public get isExpanded() {
        return this._toggle;
    }

    public hasChildren() {
        return !!this.children.size;
    }

    public toggle(state = !this._toggle) {
        this._toggle = state;
        return state && this.getThisNodeList().toggleSiblings(this.guid);
    }

    public childrenCount() {
        return this.children.size;
    }

    public isRoot() {
        return this.parentId == null;
    }

    public dragenter(event) {
        event.dataTransfer.dropEffect = 'move';
    }

    public dragleave(event) {
        this.isDragover = false;
    }

    public dragstart(event) {
        event.dataTransfer.effectAllowed = 'move';
        this.isDragging = true;
        this.toggle(false);
        this.getThisNodeList().draggingNodeGuid = this.guid;
    }

    public dragover(event) {
        event.preventDefault();
        if (!this.isDragging) {
            this.isDragover = true;
        }
        event.dataTransfer.dropEffect = 'move';
        return false;
    }

    public dragend() {
        this.isDragover = false;
        this.isDragging = false;
    }

    public drop(event) {
        event.preventDefault();
        const guid = this.getThisNodeList().draggingNodeGuid;
        this.getThisNodeList().transfer(guid, this.guid);
        return false;
    }

    public addChild() {
        const newNodeGuid = this.getThisNodeList().newNode(this.guid);
        this.children.add(newNodeGuid);
        this.toggle(true);
    }
}
