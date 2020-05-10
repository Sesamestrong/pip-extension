const runConstraints = function(constraints, competitors) {
    return constraints.reduce((competitors, next) => {
        if (competitors.length < 2) return competitors;
        const newCompetitors = competitors.filter(next);
        return newCompetitors.length ? newCompetitors : competitors;
    }, competitors)[0];
}

const mediaElementRules = [el=>!el.paused,el=>el.muted===false,el=>el.requestPictureInPicture];
