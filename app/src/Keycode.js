const keyTable = {
	"Minus": "-",
	"Equal": "=",
	"KeyQ": "Q",
	"KeyW": "W",
	"KeyE": "E",
	"KeyR": "R",
	"KeyT": "T",
	"KeyY": "Y",
	"KeyU": "U",
	"KeyI": "I",
	"KeyO": "O",
	"KeyP": "P",
	"KeyA": "A",
	"KeyS": "S",
	"KeyD": "D",
	"KeyF": "F",
	"KeyG": "G",
	"KeyH": "H",
	"KeyJ": "J",
	"KeyK": "K",
	"KeyL": "L",
	"KeyZ": "Z",
	"KeyX": "X",
	"KeyC": "C",
	"KeyV": "V",
	"KeyB": "B",
	"KeyN": "N",
	"KeyM": "M",
	"BracketLeft": "[",
	"BracketRight": "]",
	"Semicolon": ";",
	"Quote": "'",
	"Backquote": "`",
	"Backslash": "\\",
	"Delete": "Delete",
	"Insert": "Insert",
	"Enter": "Return",
	"ArrowUp": "Up",
	"ArrowDown": "Down",
	"ArrowLeft": "Left",
	"ArrowRight": "Right",
	"Home": "Home",
	"End": "End",
	"PageUp": "PageUp",
	"PageDown": "PageDown",
	"Comma": ",",
	"Period": ".",
	"Slash": "/",
	"NumpadAdd": "numadd",
	"NumpadSubtract": "numsub",
	"NumpadMultiply": "nummult",
	"NumpadDecimal": "numdec",
	"NumpadDivide": "numdiv",
	"Space": "Space",
	"Backspace": "Backspace",
	"CapsLock": "Capslock",
	"NumLock": "Numlock",
	"AudioVolumeUp": "VolumeUp",
	"VolumeUp": "VolumeUp",
	"AudioVolumeDown": "VolumeDown",
	"VolumeDown": "VolumeDown",
	"MediaTrackNext": "MediaNextTrack",
	"MediaTrackPrevious": "MediaPreviousTrack",
	"MediaPlayPause": "MediaPlayPause",
	"Media Stop" :"MediaStop"
};

for(let f = 1; f <= 24; f++) keyTable[`F${f}`] = `F${f}`;
for(let n = 0; n <= 9; n++) keyTable[`Numpad${n}`] = `num${n}`;
for(let d = 0; d <= 9; d++) keyTable[`Digit${d}`] = `${d}`;

export default function getKeyCode(evt, forceModifier = true) {
	let keyModifier = '';
	if(evt.ctrlKey) keyModifier += 'Control + ';
	if(evt.shiftKey) keyModifier += 'Shift + ';
	if(evt.altKey) keyModifier += 'Alt + ';
	if(evt.metaKey) keyModifier += 'Super + ';

	keyModifier = keyModifier.slice(0, keyModifier.length - 2);

	const isModifier = ['Control', 'Shift', 'Alt', 'Meta'].includes(evt.key);
	const convKey = keyTable[evt.code];

	if(isModifier || !convKey) {
		if(forceModifier) return '';
		return keyModifier;
	} else {
		if(keyModifier === '') {
			if(forceModifier) return '';

			return convKey;
		}

		return `${keyModifier} + ${convKey}`;
	}
};
