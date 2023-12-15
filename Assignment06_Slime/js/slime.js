// Modified version of this sketch: 
// https://editor.p5js.org/stc/sketches/F68ThMP2Z
// Changed to be more object oriented

const WEIGHTS = [
	1/16, 1/8, 1/16,
	 1/8, 1/4,  1/8,
	1/16, 1/8, 1/16,
];

class SlimeMoldSim {
    constructor(parameters) {
        this.width = parameters.width;
        this.height = parameters.height;
        this.agents = [];
        this.parameters = parameters;
        this.regenerateNext = true;
        this.counts = [0, 0, 0, 0];
    }

    reset() {
        this.regenerateNext = true;
    }

    simStep(inArray, outArray) {
        // Regenerate on first step with flag set
        if (this.regenerateNext) this.regenerate();

        const getIndex = (x, y) => {
            return x + y * this.width;
        }

        const stepSenseAndRotate = () => {
            for (let agent of this.agents) {
                const senseRelativeAngle = (theta) => {
                    return inArray[getIndex(
                        Math.round(agent.x + Math.cos(agent.heading + theta) * this.parameters.sensorDistance),
                        Math.round(agent.y + Math.sin(agent.heading + theta) * this.parameters.sensorDistance)
                    )];
                }

                const senseLeft = senseRelativeAngle(this.parameters.sensorAngle);
                const senseMiddle = senseRelativeAngle(0);
                const senseRight = senseRelativeAngle(-this.parameters.sensorAngle);

                const modifiedTurning = (this.parameters.randomTurning ? (Math.random() * 0.5 + 0.5) : 1) * this.parameters.turningSpeed;
                let option = -1;
                if (senseMiddle > senseLeft && senseMiddle > senseRight) {
                    // no change
                    option = 0;
                } else if (senseLeft > senseRight) {
                    option = 1;
                    agent.heading += modifiedTurning;
                } else if (senseRight > senseLeft) {
                    option = 2;
                    agent.heading -= modifiedTurning;
                } else {
                    option = 3;
                    agent.heading += Math.round(Math.random() * 2 - 1) * this.parameters.turningSpeed;
                }
                this.counts[option] += 1
                agent.lastOption = option;
            }
        }

        const stepMove = () => {
            for (let agent of this.agents) {
                agent.x += this.parameters.speed * Math.cos(agent.heading);
                agent.y += this.parameters.speed * Math.sin(agent.heading);
                if (this.parameters.wrapAround) {
                    agent.x = (agent.x + this.width) % this.width;
                    agent.y = (agent.y + this.height) % this.height;
                }
            }
        }

        const stepDeposit = () => {
            for (let agent of this.agents) {
                const x = Math.round(agent.x);
                const y = Math.round(agent.y);
                if (x <= 0 || y <= 0 || x >= this.width - 1 || y >= this.height - 1)
                    continue;
                outArray[getIndex(x, y)] += this.parameters.depositAmount;
            }
        }

        const stepDiffuseAndDecay = () => {
            let oldTrail = Float32Array.from(outArray);
            for (let y = 1; y < this.height - 1; ++y) {
                for (let x = 1; x < this.width - 1; ++x) {
                    const diffusedValue = (
                        oldTrail[getIndex(x - 1, y - 1)] * WEIGHTS[0] +
                        oldTrail[getIndex(x,     y - 1)] * WEIGHTS[1] +
                        oldTrail[getIndex(x + 1, y - 1)] * WEIGHTS[2] +
                        oldTrail[getIndex(x - 1, y)]     * WEIGHTS[3] +
                        oldTrail[getIndex(x,     y)]     * WEIGHTS[4] +
                        oldTrail[getIndex(x + 1, y)]     * WEIGHTS[5] +
                        oldTrail[getIndex(x - 1, y + 1)] * WEIGHTS[6] +
                        oldTrail[getIndex(x,     y + 1)] * WEIGHTS[7] +
                        oldTrail[getIndex(x + 1, y + 1)] * WEIGHTS[8]
                    );
                    outArray[getIndex(x, y)] = Math.min(1.0, diffusedValue * this.parameters.decayFactor);
                }
            }
        }

        stepSenseAndRotate();
        stepMove();
        stepDeposit();
        stepDiffuseAndDecay();
    }

    regenerate() {
        this.agents.splice(0, this.agents.length); // empty list

        if (this.parameters.startInCircle) {
            const radius = Math.min(this.width, this.height) * 0.3;
            for (let i = 0; i < this.parameters.numAgents; ++i) {
                const t = 2 * Math.PI * i / this.parameters.numAgents;
                this.agents.push({
                    x: Math.cos(t) * radius + this.width / 2,
                    y: Math.sin(t) * radius + this.height / 2,
                    heading: t - Math.PI / 2,
                });
            }
        } else {
            for (let i = 0; i < this.parameters.numAgents; ++i) {
                this.agents.push({
                    x: Math.random() * this.width,
                    y: Math.random() * this.height,
                    heading: Math.random() * 2 * Math.PI, // radians
                });
            }
        }
        this.regenerateNext = false;
    }

}