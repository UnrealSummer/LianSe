import { _decorator, Component, Node, Label, Button, Color } from 'cc';
import { IModifier } from './ModifierSystem';
const { ccclass, property } = _decorator;

/**
 * 词条选择UI
 */
@ccclass('ModifierSelectionUI')
export class ModifierSelectionUI extends Component {
    @property(Node)
    option1: Node = null;

    @property(Node)
    option2: Node = null;

    @property(Node)
    option3: Node = null;

    private modifiers: IModifier[] = [];
    private onSelectCallback: (modifier: IModifier) => void = null;

    start() {
        // Hide by default
        this.node.active = false;
        
        // Setup click events
        this.setupOption(this.option1, 0);
        this.setupOption(this.option2, 1);
        this.setupOption(this.option3, 2);
    }

    /**
     * 显示词条选择
     */
    show(modifiers: IModifier[], onSelect: (modifier: IModifier) => void): void {
        this.modifiers = modifiers;
        this.onSelectCallback = onSelect;
        
        // Update UI
        this.updateOption(this.option1, modifiers[0]);
        this.updateOption(this.option2, modifiers[1]);
        this.updateOption(this.option3, modifiers[2]);
        
        // Show UI
        this.node.active = true;
        
        console.log('[ModifierSelectionUI] Showing selection');
    }

    /**
     * 隐藏UI
     */
    hide(): void {
        this.node.active = false;
    }

    /**
     * 设置选项点击事件
     */
    private setupOption(option: Node, index: number): void {
        if (!option) return;
        
        // Add button component if not exists
        let button = option.getComponent(Button);
        if (!button) {
            button = option.addComponent(Button);
        }
        
        // Add click event
        option.on(Node.EventType.TOUCH_END, () => {
            this.onOptionClicked(index);
        });
    }

    /**
     * 更新选项显示
     */
    private updateOption(option: Node, modifier: IModifier): void {
        if (!option || !modifier) return;
        
        // Find name label
        const nameLabel = option.getChildByName('Name')?.getComponent(Label);
        if (nameLabel) {
            nameLabel.string = modifier.name;
            
            // Set color by rarity
            if (modifier.rarity === 'epic') {
                nameLabel.color = new Color(200, 100, 255);  // 紫色
            } else if (modifier.rarity === 'rare') {
                nameLabel.color = new Color(100, 150, 255);  // 蓝色
            } else {
                nameLabel.color = new Color(255, 255, 255);  // 白色
            }
        }
        
        // Find description label
        const descLabel = option.getChildByName('Description')?.getComponent(Label);
        if (descLabel) {
            descLabel.string = modifier.description;
        }
        
        console.log(`[ModifierSelectionUI] Updated option: ${modifier.name}`);
    }

    /**
     * 选项被点击
     */
    private onOptionClicked(index: number): void {
        if (index < 0 || index >= this.modifiers.length) return;
        
        const selected = this.modifiers[index];
        console.log(`[ModifierSelectionUI] Selected: ${selected.name}`);
        
        // Hide UI
        this.hide();
        
        // Callback
        if (this.onSelectCallback) {
            this.onSelectCallback(selected);
        }
    }
}
