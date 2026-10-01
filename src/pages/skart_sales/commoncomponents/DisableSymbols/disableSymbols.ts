export const disableSymbols = (e: React.KeyboardEvent<HTMLInputElement>) => {

    const prohibitedSymbols = /[,.\/\\|'"`;:{}[\]()*&^%$?#@!`~+=<>_-]/;

    if (!e.ctrlKey && !e.altKey && !e.metaKey && e.key.length === 1 && prohibitedSymbols.test(e.key)) {
        e.preventDefault();
    }
};