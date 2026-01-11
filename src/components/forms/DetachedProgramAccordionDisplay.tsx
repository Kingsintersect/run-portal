'use client';

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

export type ProgramNode = {
    id: number;
    name: string;
    children?: ProgramNode[];
};

interface DetachedProgramAccordionProps {
    nodes: ProgramNode[];
    level?: number;
    selectedValue?: string;
    onProgramSelect: (program: { id: number; name: string }) => void;
}

// Standalone accordion component without form dependencies
export function DetachedProgramAccordion({
    nodes,
    level = 0,
    selectedValue,
    onProgramSelect,
}: DetachedProgramAccordionProps) {
    const handleProgramSelect = (node: ProgramNode) => {
        onProgramSelect({ id: node.id, name: node.name });
    };

    return (
        <Accordion type="multiple" className={`pl-${level * 4}`}>
            {Array.isArray(nodes) && nodes.map((node, index) => {
                const id = `${level}-${index}-${node.name}`;

                return (
                    <AccordionItem key={id} value={id}>
                        <AccordionTrigger className="text-left">{node.name}</AccordionTrigger>
                        <AccordionContent>
                            <div
                                className={`pl-4 py-1 cursor-pointer rounded ${selectedValue === node.name
                                    ? "bg-primary text-white"
                                    : "hover:bg-muted"
                                    }`}
                                onClick={() => handleProgramSelect(node)}
                            >
                                🎓 {node.name}
                            </div>
                            {Array.isArray(node.children) && node.children.length > 0 && (
                                <DetachedProgramAccordion
                                    nodes={node.children}
                                    level={level + 1}
                                    selectedValue={selectedValue}
                                    onProgramSelect={onProgramSelect}
                                />
                            )}
                        </AccordionContent>
                    </AccordionItem>
                );
            })}
        </Accordion>
    );
}

interface DetachedProgramAccordionDisplayProps {
    programs: ProgramNode[];
    selectedValue?: string;
    onProgramSelect: (program: { id: number; name: string }) => void;
    heading?: string;
    subHeading?: string;
    error?: string;
}

export const DetachedProgramAccordionDisplay = ({
    programs,
    selectedValue,
    onProgramSelect,
    heading,
    subHeading,
    error,
}: DetachedProgramAccordionDisplayProps) => {
    return (
        <div className="max-w-3xl mx-auto p-4">
            {heading && <h1 className="text-2xl font-bold mb-0 text-site-b-dark">{heading}</h1>}
            {subHeading && <p className="italic text-site-a-dark mb-4">{subHeading}</p>}

            <DetachedProgramAccordion
                nodes={programs}
                selectedValue={selectedValue}
                onProgramSelect={onProgramSelect}
            />

            {error && (
                <p className="text-red-500 text-sm mb-2">
                    {error}
                </p>
            )}

            {selectedValue && (
                <div className="mt-6 text-green-700 font-semibold border-t pt-4">
                    ✅ You selected: <span className="text-primary">{selectedValue}</span>
                </div>
            )}
        </div>
    );
};