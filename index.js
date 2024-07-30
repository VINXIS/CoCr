const baseURL = "https://api.cobalt.tools/api";

function errorPost(text) {
    console.error(text);
    document.body.innerHTML = text;
}

async function run() {
    const options = await chrome.storage.sync.get({
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
    });
    
    console.log("optoins", options);
    const currTabs = await chrome.tabs.query({ active: true, currentWindow: true });
    const url = currTabs[0].url;
    
    const data = await fetch(`${baseURL}/json`, {
        method: "POST",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ url, ...options })
    }).then(res => res.json());

    // Derived much from https://github.com/imputnet/cobalt/blob/current/src/front/cobalt.js#L431
    if (data.status === "error") {
        errorPost(data.text);
        return;
    }

    if (data.text && (!data.url || !data.picker)) {
        if (data.status === "success")
            errorPost(data.text);
        else
            errorPost("cobalt.tools didn't get a download link from the server. This should never happen. Try again, but if it still doesn't work, check the <a class=\"text-backdrop link\" href=\"{statusPage}\" target=\"_blank\">status page</a> or <a class=\"text-backdrop link\" href=\"{https://github.com/imputnet/cobalt/issues}\" target=\"_blank\">create an issue on github</a>");
        return;
    }

    switch (data.status) {
        case "redirect":
            window.open(data.url, "_blank");
            break;
        case "stream":
            const getStream = await fetch(`${data.url}&p=1`).then(res => res.json());
            if (!getStream) {
                errorPost("There's no internet, or cobalt api is temporarily unavailable. Check your connection and try again.");
                return;
            }

            if (getStream.status !== "continue") {
                errorPost(getStream.text);
                return;
            }

            window.open(data.url, "_blank");
            break;
        case "picker":
            if (!data.picker) {
                errorPost("cobalt.tools didn't get a download link from the server. This should never happen. Try again, but if it still doesn't work, check the <a class=\"text-backdrop link\" href=\"{statusPage}\" target=\"_blank\">status page</a> or <a class=\"text-backdrop link\" href=\"{https://github.com/imputnet/cobalt/issues}\" target=\"_blank\">create an issue on github</a>");
                return;
            }

            document.body.innerHTML = `<p>Pick what to save</p><p>Click or right click to download what you want</p>`;
            switch (data.pickerType) {
                case "images":
                    for (let i in data.picker) {
                        document.body.innerHTML += `<a href="${text.arr[i]["url"]}" target="_blank"><img src="${text.arr[i]["url"]}" onerror="this.parentNode.style.display='none'"></a>`;
                    }
                    document.body.innerHTML += `<a href=${data.audio} target="_blank">Download Audio</a>`;
                    break;
                default:
                    for (let i in data.picker) {
                        document.body.innerHTML += `<a href="${text.arr[i]["url"]}" target="_blank"><div>${text.arr[i].type}</div>${text.arr[i].type === 'photo' ? '' : '<div></div>'}<img src="${text.arr[i]["thumb"]}" onerror="this.style.display='none'"></a>`;
                    }
                    break;
            }
            break;
        case "success":
            errorPost(data.text);
            break;
        default:
            errorPost("cobalt.tools sent an unknown status. Try again, but if it still doesn't work, check the <a class=\"text-backdrop link\" href=\"{statusPage}\" target=\"_blank\">status page</a> or <a class=\"text-backdrop link\" href=\"{https://github.com/imputnet/cobalt/issues}\" target=\"_blank\">create an issue on github</a>");
    } 
}

document.addEventListener("DOMContentLoaded", run);