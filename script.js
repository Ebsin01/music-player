document.addEventListener('DOMContentLoaded', function() {
    
    const playPauseBtn = document.getElementById('play-pause');
    const prevBtn = document.getElementById('prev');
    const nextBtn = document.getElementById('next');
    const progressBar = document.querySelector('.progress-bar');
    const progress = document.querySelector('.progress');
    const progressHandle = document.querySelector('.progress-handle');
    const currentTimeEl = document.querySelector('.current-time');
    const totalTimeEl = document.querySelector('.total-time');
    const songTitleEl = document.querySelector('.song-title');
    const artistNameEl = document.querySelector('.artist-name');
    const albumArtEl = document.querySelector('.album-art img');

    
    const audio = new Audio();

    
    let isPlaying = true;
    let currentSongIndex = 0;
    let isDragging = false;

    
    const songs = [
        {
            id: 'song2',
            title: 'Fairytale',
            artist: 'Alexonder Rybok',
            duration: '03:02'
        },
        {
            id: 'song1',
            title: "I'm Good",
            artist: 'David Guetta & Bebe Rexha',
            duration: '02:57'
        },
        {
            id: 'song3',
            title: 'Thunder',
            artist: 'Imagine Dragon',
            duration: '02:18'
        }
    ];

    
    function init() {
        loadSong(currentSongIndex);

        
        audio.play().catch(() => {
            
            isPlaying = false;
            updatePlayPauseIcon();
        });

        
        audio.addEventListener('timeupdate', updateProgress);
        audio.addEventListener('ended', nextSong);
        playPauseBtn.addEventListener('click', togglePlayPause);
        prevBtn.addEventListener('click', prevSong);
        nextBtn.addEventListener('click', nextSong);
        progressBar.addEventListener('click', setProgress);

        
        progressHandle.addEventListener('mousedown', startDrag);
        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', endDrag);

        
        progressHandle.addEventListener('touchstart', startDrag);
        document.addEventListener('touchmove', drag);
        document.addEventListener('touchend', endDrag);
    }

    
    function loadSong(index) {
        const song = songs[index];
        const songId = song.id;

        
        const imagePath = `assets/images/${songId}.jpg`;

        
        try {
            
            audio.src = `https://www.soundhelix.com/examples/mp3/SoundHelix-Song-${index + 1}.mp3`;

            
            audio.src = `assets/music/${songId}.mp3`;
        } catch (e) {
            console.log('Error loading audio file, using fallback');
            audio.src = `https://www.soundhelix.com/examples/mp3/SoundHelix-Song-${index + 1}.mp3`;
        }

        
        songTitleEl.textContent = song.title;
        artistNameEl.textContent = song.artist;
        albumArtEl.src = imagePath;
        totalTimeEl.textContent = song.duration;

        
        document.body.style.setProperty('--bg-image', `url('${imagePath}')`);

        
        currentTimeEl.textContent = '00:00';
        progress.style.width = '0%';
        progressHandle.style.left = '0%';
    }

    
    function formatTime(seconds) {
        if (isNaN(seconds)) return '00:00';

        const min = Math.floor(seconds / 60);
        const sec = Math.floor(seconds % 60);

        return `${min < 10 ? '0' + min : min}:${sec < 10 ? '0' + sec : sec}`;
    }

    
    function updateProgress() {
        if (!isDragging) {
            const { currentTime, duration } = audio;
            if (duration) {
                const progressPercent = (currentTime / duration) * 100;

                
                progress.style.width = `${progressPercent}%`;

                
                progressHandle.style.left = `${progressPercent}%`;

                
                currentTimeEl.textContent = formatTime(currentTime);

                
                if (progressPercent > 90) {
                    progressHandle.classList.add('pulse');
                } else {
                    progressHandle.classList.remove('pulse');
                }
            }
        }
    }

    
    function setProgress(e) {
        const width = this.clientWidth;
        const clickX = e.offsetX;
        const duration = audio.duration;
        const progressPercent = (clickX / width) * 100;

        progress.style.width = `${progressPercent}%`;
        progressHandle.style.left = `${progressPercent}%`;
        audio.currentTime = (clickX / width) * duration;
    }

    
    function startDrag() {
        isDragging = true;
    }

    
    function drag(e) {
        if (isDragging) {
            const progressBar = document.querySelector('.progress-bar');
            const rect = progressBar.getBoundingClientRect();
            let x;

            if (e.type === 'touchmove') {
                x = e.touches[0].clientX - rect.left;
            } else {
                x = e.clientX - rect.left;
            }

            
            x = Math.max(0, Math.min(x, rect.width));

            const progressPercent = (x / rect.width) * 100;
            progress.style.width = `${progressPercent}%`;
            progressHandle.style.left = `${progressPercent}%`;
        }
    }

    
    function endDrag(e) {
        if (isDragging) {
            isDragging = false;

            const progressBar = document.querySelector('.progress-bar');
            const rect = progressBar.getBoundingClientRect();
            let x;

            if (e.type === 'touchend') {
                x = e.changedTouches[0].clientX - rect.left;
            } else {
                x = e.clientX - rect.left;
            }

            
            x = Math.max(0, Math.min(x, rect.width));

            const progressPercent = (x / rect.width) * 100;
            audio.currentTime = (progressPercent / 100) * audio.duration;
        }
    }

    
    function togglePlayPause() {
        if (isPlaying) {
            audio.pause();
        } else {
            audio.play();
        }
        isPlaying = !isPlaying;
        updatePlayPauseIcon();
    }

    
    function updatePlayPauseIcon() {
        playPauseBtn.innerHTML = isPlaying ?
            '<i class="fas fa-pause"></i>' :
            '<i class="fas fa-play"></i>';
    }

    
    function prevSong() {
        currentSongIndex--;
        if (currentSongIndex < 0) {
            currentSongIndex = songs.length - 1;
        }
        loadSong(currentSongIndex);
        if (isPlaying) {
            audio.play();
        }
    }

    
    function nextSong() {
        currentSongIndex++;
        if (currentSongIndex >= songs.length) {
            currentSongIndex = 0;
        }
        loadSong(currentSongIndex);
        if (isPlaying) {
            audio.play();
        }
    }

    
    init();
});