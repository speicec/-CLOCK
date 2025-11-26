import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface SortableItemProps {
  id: string;
  children: React.ReactNode;
}

export const SortableItem: React.FC<SortableItemProps> = ({ id, children }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 1,
    opacity: isDragging ? 0.8 : 1,
    position: 'relative' as const,
  };

  return (
    <div ref={setNodeRef} style={style} className="mb-6 relative group">
      {/* Drag Handle */}
      <div 
        {...attributes} 
        {...listeners} 
        className="absolute -left-2 top-0 bottom-0 w-8 flex items-center justify-center cursor-grab active:cursor-grabbing text-gray-300 hover:text-black z-20 md:opacity-0 md:group-hover:opacity-100 transition-opacity touch-none"
        title="按住拖拽排序"
      >
        <div className="flex flex-col gap-1 p-1 bg-white/50 rounded md:bg-transparent">
            <div className="w-1 h-1 bg-current rounded-full"></div>
            <div className="w-1 h-1 bg-current rounded-full"></div>
            <div className="w-1 h-1 bg-current rounded-full"></div>
        </div>
      </div>
      
      {/* Content wrapper with left margin for handle */}
      <div className="pl-5 md:pl-0">
         {children}
      </div>
    </div>
  );
};