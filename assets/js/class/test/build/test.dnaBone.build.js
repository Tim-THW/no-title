import * as THREE from '../../../lib/three.module.js'
import Particle from '../../objects/particle.js'
import Shader from '../shader/test.dnaBone.shader.js'

export default class{
    constructor({group}){
        this.group = group

        this.group.rotation.z = -90 * RADIAN

        this.particles = []

        this.init()
    }


    // init
    init(){
        this.create()
    }


    // create
    create(){
        this.rightGroup = new THREE.Group()
        this.leftGroup = new THREE.Group()

        this.createObjects(this.rightGroup)
        this.createObjects(this.leftGroup, 180)
    }
    createObjects(finalGroup, rotX = 0){
        this.createBone(finalGroup)

        finalGroup.rotation.x = rotX * RADIAN

        this.group.add(finalGroup)
    }
    createBone(finalGroup){
        const degree = 8
        const count = 30
        const maxY = 50
        const stepY = maxY / (count - 1)
        const radius = 10
        const position = []

        for(let i = 0; i < count; i++){
            const deg = i * degree % 360
            const x = Math.cos(deg * RADIAN) * radius
            const y = stepY * i
            const z = Math.sin(deg * RADIAN) * radius

            const deg2 = (180 + i * degree) % 360
            const x2 = Math.cos(deg2 * RADIAN) * radius
            const y2 = stepY * i
            const z2 = Math.sin(deg2 * RADIAN) * radius
            
            position.push(x, y, z)
            position.push(x2, y2, z2)
        }

        const particle = new Particle({
            materialName: 'ShaderMaterial',
            materialOpt: {
                vertexShader: Shader.vertex,
                fragmentShader: Shader.fragment,
                transparent: true,
                uniforms: {
                    uColor: {value: new THREE.Color(0xffffff)},
                    uPointSize: {value: 16.0},
                    uTime: {value: 0}
                }
            }
        })

        particle.setAttribute('position', new Float32Array(position), 3)

        finalGroup.add(particle.get())
    }


    // animate
    animate(){
        this.group.rotation.x += 0.01

        this.updateUniforms('rightGroup')
        this.updateUniforms('leftGroup')
    }
    updateUniforms(groupName){
        const time = window.performance.now()

        this[groupName].children.forEach(particle => {
            const uniforms = particle.material.uniforms
            uniforms['uTime'].value = time
        })
    }
}