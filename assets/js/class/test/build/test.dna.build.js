import * as THREE from '../../../lib/three.module.js'
import Particle from '../../objects/particle.js'
import Shader from '../shader/test.dnaBone.shader.js'
import Method from '../../../method/method.js'

export default class{
    constructor({group}){
        this.group = group

        this.group.rotation.z = -90 * RADIAN

        this.bones = []
        this.nucleos = []

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
    // bone
    createBone(finalGroup){
        const degree = 8
        const count = 30
        const maxY = 50
        const stepY = maxY / (count - 1)
        const radius = 10

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

        const {position, size} = this.createBoneAttributes({degree, count, stepY, radius})

        particle.setAttribute('position', new Float32Array(position), 3)
        particle.setAttribute('aPointSize', new Float32Array(size), 1)

        this.bones.push(particle)

        finalGroup.add(particle.get())
    }
    createBoneAttributes({degree, count, stepY, radius}){
        const position = []
        const size = []

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

            const s = THREE.Math.randFloat(6, 20)

            size.push(s, s)
        }

        return {position, size}
    }
    // nucleo
    createNucleo(){

    }


    // animate
    animate(){
        this.group.rotation.x += 0.015

        this.updateBones()
    }
    updateBones(){
        const time = window.performance.now()

        this.bones.forEach(bone => {
            const aPointSize = bone.getAttribute('aPointSize')
            const psizeArr = aPointSize.array

            bone.setUniform('uTime', time)

            for(let i = 0; i < psizeArr.length; i++){
                const r = SIMPLEX.noise2D(i * 0.1, time * 0.002)
                const n = Method.normalize(r, 6, 20, -1, 1)
                psizeArr[i] = n
            }

            aPointSize.needsUpdate = true
        })
    }
    updateNucleos(){
        
    }
}