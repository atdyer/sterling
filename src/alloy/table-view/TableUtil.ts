import { AlloyElement } from 'alloy-ts';
import { AlloyNameFn } from '../../sterling/SterlingTypes';

function nameFunction (remove_this: boolean): AlloyNameFn {
    return (item: AlloyElement) => {
        return remove_this
            ? removeThis(item.id())
            : item.id();
    }
}

function removeThis (name: string): string {
    return name.replace(/^this\//, '');
}

export {
    nameFunction
};
