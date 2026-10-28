import React from "react";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, arrayMove, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { CSS } from "@dnd-kit/utilities";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGripVertical } from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";
import SongItem from "../../components/SongItem/SongItem";

function SortableRow({ song, i, playlist, onRemovedFromPlaylist }) {
  const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition, isDragging } = useSortable({ id: song._id });

  return (
    <div
      ref={setNodeRef}
      className={`sortableRow ${isDragging ? "dragging" : ""}`}
      style={{ transform: CSS.Transform.toString(transform), transition }}
    >
      {/* Entry animation lives on an inner element so it does not fight the drag transform */}
      <motion.div
        className="sortableRowInner"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: i * 0.05, duration: 0.3 }}
      >
      <button
        type="button"
        className="dragHandle"
        ref={setActivatorNodeRef}
        aria-label={`Move ${song.title}`}
        {...attributes}
        {...listeners}
      >
        <FontAwesomeIcon icon={faGripVertical} />
      </button>
      <SongItem inPlaylist={true} song={song} i={i} playlistUserId={playlist.user._id} playlistId={playlist._id} onRemovedFromPlaylist={onRemovedFromPlaylist} noAnimation />
      </motion.div>
    </div>
  );
}

// Drag-and-drop song list for the playlist owner; onReorder receives the new song array
export default function SortableSongList({ playlist, onReorder, onRemovedFromPlaylist }) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = ({ active, over }) => {
    if (!over || active.id === over.id) return;
    const from = playlist.songs.findIndex(s => s._id === active.id);
    const to = playlist.songs.findIndex(s => s._id === over.id);
    onReorder(arrayMove(playlist.songs, from, to));
  };

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} modifiers={[restrictToVerticalAxis]} onDragEnd={handleDragEnd}>
      <SortableContext items={playlist.songs.map(s => s._id)} strategy={verticalListSortingStrategy}>
        {playlist.songs.map((song, i) => (
          <SortableRow key={song._id} song={song} i={i} playlist={playlist} onRemovedFromPlaylist={onRemovedFromPlaylist} />
        ))}
      </SortableContext>
    </DndContext>
  );
}
