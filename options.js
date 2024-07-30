// Saves options to chrome.storage
const saveOptions = () => {
	const options = {
		vCodec: document.getElementById('vCodec').value,
		vQuality: document.getElementById('vQuality').value,
		aFormat: document.getElementById('aFormat').value,
		filenamePattern: document.getElementById('filenamePattern').value,
		isAudioOnly: document.getElementById('isAudioOnly').checked,
		isTTFullAudio: document.getElementById('isTTFullAudio').checked,
		isAudioMuted: document.getElementById('isAudioMuted').checked,
		dubLang: document.getElementById('dubLang').checked,
		disableMetadata: document.getElementById('disableMetadata').checked,
		twitterGif: document.getElementById('twitterGif').checked,
		tiktokH265: document.getElementById('tiktokH265').checked,
	};

	chrome.storage.sync.set(options, () =>
	{
		const status = document.getElementById('status');
		status.textContent = 'Options saved.';
		setTimeout(() =>
		{
			status.textContent = '';
		}, 750);
	});
};

// Restores select box and checkbox state using the preferences stored in chrome.storage.
const restoreOptions = () => {
	chrome.storage.sync.get(
	{
		vCodec: 'h264',
		vQuality: '720',
		aFormat: 'mp3',
		filenamePattern: 'classic',
		isAudioOnly: false,
		isTTFullAudio: false,
		isAudioMuted: false,
		dubLang: false,
		disableMetadata: false,
		twitterGif: false,
		tiktokH265: false,
	}, (items) =>
	{
		document.getElementById('vCodec').value = items.vCodec;
		document.getElementById('vQuality').value = items.vQuality;
		document.getElementById('aFormat').value = items.aFormat;
		document.getElementById('filenamePattern').value = items.filenamePattern;
		document.getElementById('isAudioOnly').checked = items.isAudioOnly;
		document.getElementById('isTTFullAudio').checked = items.isTTFullAudio;
		document.getElementById('isAudioMuted').checked = items.isAudioMuted;
		document.getElementById('dubLang').checked = items.dubLang;
		document.getElementById('disableMetadata').checked = items.disableMetadata;
		document.getElementById('twitterGif').checked = items.twitterGif;
		document.getElementById('tiktokH265').checked = items.tiktokH265;
	});
};

document.addEventListener('DOMContentLoaded', restoreOptions);
document.getElementById('save').addEventListener('click', saveOptions);