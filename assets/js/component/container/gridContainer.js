import vSection from '../section/vSection.js'
import vSectionBox from '../section/vSectionBox.js'
import vSectionElementItem from '../section/vSectionElementItem.js'

const getCount = ({width, height, size, sw, sh}) => {
    if(!size) return {count: 1}

    const squareWidth = size * sw
    const squareHeight = size * sh

    const rw = Math.ceil(width / squareWidth)
    const pw = rw === 0 ? 1 : rw

    const rh = Math.ceil(height / squareHeight)
    const ph = rh === 0 ? 1 : rh
    const count = pw * ph

    return {count}
}

export default {
    components: {
        'v-section': vSection,
        'v-section-box': vSectionBox,
        'v-section-element-item': vSectionElementItem
    },
    template: `
        <div id="grid-container">

            <v-section
                v-for="section in sections"
                :key="section.position"
                :sectionStyle="section.sectionStyle"
            >
                <v-section-box
                    :class="section.boxClassName" 
                    :size="section.size"
                    :ref="el => section.boxRef = el"
                >
                    <v-section-element-item
                        v-for="item in section.items"
                        :key="item.key"
                    />
                </v-section-box>
            </v-section>
            
        </div>
    `,
    setup(){
        const {ref, onMounted} = Vue

        const positions = ['center', 'top', 'right', 'bottom', 'left']
        const size = 80
        const sw = 3
        const sh = 2

        const sections = ref(positions.map((position, key) => ({
            sectionStyle: {gridArea: position},
            position,
            boxClassName: `vSection-box-${position}`,
            size: position === 'center' ? undefined : size,
            boxRef: null,
            items: []
        })))

        const resize = () => {
            sections.value.forEach(section => {
                const {size, boxRef} = section
                const box = boxRef.box
                const items = section.items
                const {width, height} = box.getBoundingClientRect()

                const {count} = getCount({width, height, size, sw, sh})

                updateItems(items, count)
            })
        }

        const updateItems = (items, count) => {
            const len = items.length

            if(len > count){
                for(let i = 0; i < len - count; i++) items.pop()
            }else{
                for(let i = 0; i < count - len; i++) items.push({key: len + i})
            }
        }
        
        onMounted(() => {
            resize()
            window.addEventListener('resize', () => resize())
        })

        return{
            sections
        }
    }
}