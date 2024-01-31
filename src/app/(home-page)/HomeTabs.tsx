'use client'
import { DEFAULT_PADDING } from '@/configs/theme'
import useDrag from '@/hooks/useDrag'
import { Box } from '@chakra-ui/react'
import React from 'react'
import { ScrollMenu, VisibilityContext } from 'react-horizontal-scrolling-menu'

type Props = {}
type scrollVisibilityApiType = React.ContextType<typeof VisibilityContext>;


const elemPrefix = "test";
const getId = (index: number) => `${elemPrefix}${index}`;
const getItems = () =>
    Array(20)
        .fill(0)
        .map((_, ind) => ({ id: getId(ind) }));

export default function HomeTabs({ }: Props) {
    const [items] = React.useState(getItems);

    const { dragStart, dragStop, dragMove, dragging } = useDrag();
    const handleDrag = ({ scrollContainer }: scrollVisibilityApiType) => (
        ev: React.MouseEvent
    ) =>
        dragMove(ev, (posDiff) => {
            if (scrollContainer.current) {
                scrollContainer.current.scrollLeft += posDiff;
            }
        });

    const [selected, setSelected] = React.useState<string>("");
    const handleItemClick = (itemId: string) => () => {
        if (dragging) {
            return false;
        }
        setSelected(selected !== itemId ? itemId : "");
    };

    return (
        <Box onMouseLeave={dragStop} py={DEFAULT_PADDING}>
            <ScrollMenu
                onWheel={onWheel}
                onMouseDown={() => dragStart}
                onMouseUp={() => dragStop}
                onMouseMove={handleDrag}
            >
                {items.map(({ id }) => (
                    <Box ml={DEFAULT_PADDING}>
                        <EachTab label={id} />
                    </Box>
                ))}
            </ScrollMenu>
        </Box>
    )
}

function onWheel(apiObj: scrollVisibilityApiType, ev: React.WheelEvent): void {
    const isThouchpad = Math.abs(ev.deltaX) !== 0 || Math.abs(ev.deltaY) < 15;

    if (isThouchpad) {
        ev.stopPropagation();
        return;
    }

    if (ev.deltaY < 0) {
        apiObj.scrollNext();
    } else if (ev.deltaY > 0) {
        apiObj.scrollPrev();
    }
}

const EachTab = ({ label }: { label: string }) => {
    return (
        <Box
            userSelect={'none'}
            rounded={'xl'}
            border={'1px'}
            borderColor={'border_color'}
            _dark={{
                borderColor: 'dark_light',
            }}
            p={DEFAULT_PADDING}
            w='100%'
        >
            {label}
            {/* <Text>{label}</Text> */}
        </Box>
    )
}
