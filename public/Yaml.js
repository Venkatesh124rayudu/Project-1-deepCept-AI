let cameraCount = 0;

function addCamera() {
    cameraCount++;
    const camerasContainer = document.getElementById('camerasContainer');
    const newCameraUL = document.createElement('ul');
    newCameraUL.className = 'option';
    newCameraUL.innerHTML = `
        <li class="option">
        <i class="bx"></i>
            <span class="option-text">
                <label for="camera_name_${cameraCount}">Camera Name:</label>
                <input type="text" id="camera_name_${cameraCount}" name="camera_name_${cameraCount}">
            </span>
        </li>
        <i class="bx"></i>
            <span class="option-text">
                <label for="Local_${cameraCount}">Local:</label>
                <input type="radio" id="Local_${cameraCount}" name="camera_type_${cameraCount}">
                <label for="IP_${cameraCount}">IP:</label>
                <input type="radio" id="IP_${cameraCount}" name="camera_type_${cameraCount}">
            </span>
        </li>
        <li class="option">
            <i class="bx"></i>
            <span class="option-text">
                <label for="path_${cameraCount}">Path:</label>
                <input type="text" id="path_${cameraCount}" name="path_${cameraCount}">
            </span>
        </li>
        <li class="option">
            <i class="bx"></i>
            <span class="option-text">
                <label for="path_stream_${cameraCount}">Path Stream:</label>
                <input type="text" id="path_stream_${cameraCount}" name="path_stream_${cameraCount}">
            </span>
        </li>
        <li class="option">
            <i class="bx"></i>
            <span class="option-text">
                <label for="path_monitor_${cameraCount}">Path Monitor:</label>
                <input type="text" id="path_monitor_${cameraCount}" name="path_monitor_${cameraCount}">
            </span>
        </li>
        <li class="option" id="rolesContainer_${cameraCount}">
            <i class="bx"></i>
            <span class="option-text">
                <button type="button" onclick="addRole(${cameraCount})">Add Role</button>
            </span>
        </li>
        <li class="option">
            <i class="bx"></i>
            <span class="option-text">
                <label for="width_${cameraCount}">Width:</label>
                <input type="number" id="width_${cameraCount}" name="width_${cameraCount}" min="0">
            </span>
        </li>
        <li class="option">
            <i class="bx"></i>
            <span class="option-text">
                <label for="height_${cameraCount}">Height:</label>
                <input type="number" id="height_${cameraCount}" name="height_${cameraCount}" min="0">
            </span>
        </li>
        <li class="option">
            <i class="bx"></i>
            <span class="option-text">
                <label for="fps_${cameraCount}">FPS:</label>
                <input type="number" id="fps_${cameraCount}" name="fps_${cameraCount}" min="0">
            </span>
        </li>
        <li class="option" id="tracksContainer_${cameraCount}">
            <i class="bx"></i>
            <span class="option-text">
                <button type="button" onclick="addTrack(${cameraCount})">Add Track</button>
            </span>
            </li>
        <li class="option">
            <i class="bx"></i>
            <span class="option-text">
                <label for="enabled_rtmp_${cameraCount}">Enabled RTMP:</label>
                <input type="checkbox" id="enabled_rtmp_${cameraCount}" name="enabled_rtmp_${cameraCount}">
            </span>
        </li>
    `;
    camerasContainer.appendChild(newCameraUL);
}
function addRole(cameraNumber) {
    const rolesContainer = document.getElementById(`rolesContainer_${cameraNumber}`);
    const newRoleInput = document.createElement('input');
    newRoleInput.type = 'text';
    newRoleInput.name = `roles_${cameraNumber}[]`;
    rolesContainer.appendChild(newRoleInput);
}
function addTrack(cameraNumber) {
    const tracksContainer = document.getElementById(`tracksContainer_${cameraNumber}`);
    const newTrackInput = document.createElement('input');
    newTrackInput.type = 'text';
    newTrackInput.name = `tracks_${cameraNumber}[]`;
    tracksContainer.appendChild(newTrackInput);
}
function generateYAML() {
    const yamlData = {
        mqtt: {
            host: document.getElementById('host').value,
            user: document.getElementById('user').value,
            password: document.getElementById('password').value,
            topic_prefix: "deepcept"
        },
        detectors: {
            type: document.getElementById('type').value,
            device: document.getElementById('device').value
        },
        record: {
            enabled: document.getElementById('enabled').checked,
            retain_days: document.getElementById('retain_days').value,
            default_re: document.getElementById('default_re').value,
        },
        snapshots: {
            enabled: document.getElementById('enabled_snap').checked,
            bounding_box: document.getElementById('bounding_box').checked,
            crop: document.getElementById('crop').checked,
            default_snap: document.getElementById('default_snap').value
        },
        cameras: {}
    };

    for (let i = 1; i <= cameraCount; i++) {
        const cameraName = document.getElementById(`camera_name_${i}`).value.trim();
        const path = document.getElementById(`path_${i}`).value.trim();
        const input_args = '-re -stream_loop -1 -fflags +genpts'
        const pathStream = document.getElementById(`path_stream_${i}`).value.trim();
        const pathMonitor = document.getElementById(`path_monitor_${i}`).value.trim();
        const rolesInputs = document.getElementsByName(`roles_${i}[]`);
        const roles = Array.from(rolesInputs).map(input => input.value.trim());
        const width = document.getElementById(`width_${i}`).value.trim();
        const height = document.getElementById(`height_${i}`).value.trim();
        const fps = document.getElementById(`fps_${i}`).value.trim();
        const tracksInputs = document.getElementsByName(`tracks_${i}[]`);
        const tracks = Array.from(tracksInputs).map(input => input.value.trim());
        const enabledRtmp = document.getElementById(`enabled_rtmp_${i}`).checked;
        const isIPSelected = document.getElementById(`IP_${i}`).checked;
        yamlData.cameras[cameraName] = {
            ffmpeg: {
                inputs: [
                    {
                        path,
                        input_args: isIPSelected ? undefined : '-re -stream_loop -1 -fflags +genpts',
                    },
                    {
                        path: pathStream
                    },
                    {
                        path: pathMonitor,
                        roles: roles,
                    },
                ],
            },
            detect: {
                width,
                height,
                fps
            },
            object: {
                track:tracks
            },
            rtmp: {
                enabled: enabledRtmp
            }
        };
    }

    const yamlString = jsyaml.dump(yamlData);

    console.log(yamlString);
    fetch('/generateYAML', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ yamlString }),
    })
    .then((response) => response.json())
    .then((data) => {
        console.log(data.message);
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}
