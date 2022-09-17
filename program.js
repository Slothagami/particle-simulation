var canv, c, fps = 24
window.addEventListener("load", () => {
    canv = document.querySelector("canvas")
    c = canv.getContext("2d")
    
    const resize = ()=> {
        canv.width  = window.innerWidth
        canv.height = window.innerHeight
    }
    resize()
    document.addEventListener("resize", resize)
    
    init()
    setInterval(main, 1000 / fps)
})

var particles = {all: []}, 
    colors = ["red", "blue", "green", "orange"],
    rules  = []

function init() {
    // random effect distances
    for(let color of colors) {
        Particle.effectiveDistance[color] = random(30, 200)
    }

    let usedColors = []
    for(let color of colors) {
        Particle.populate(color, Math.round(random(0, 600)))

        // randomize rules
        for(let affected of colors) {
            // if(!usedColors.includes(affected)) {
                Particle.addRule(color, affected, random(-4,4))
            // }
        }
        usedColors.push(color)
    }

    console.log(JSON.stringify(rules))
}

function main() {
    // c.fillStyle = "#10101070"
    // c.fillRect(0,0, canv.width, canv.height)
    c.clearRect(0,0, canv.width, canv.height)

    // apply  rules
    for(let rule of rules) Particle.rule.apply(null, rule)
    for(particle of particles.all) particle.update()
}
