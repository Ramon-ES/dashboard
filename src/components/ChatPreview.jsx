export default function ChatPreview() {
  return (
    <div className="bg-white rounded-lg shadow p-4 h-full flex flex-col">
      <h3 className="text-lg font-semibold mb-4">Steve</h3>
      <div className="flex-1 space-y-2 overflow-y-auto text-sm">
        <div className="text-right">
          <p className="inline-block bg-blue-100 p-2 rounded">You: Lorem ipsum dolor sit...</p>
        </div>
        <div>
          <p className="inline-block bg-gray-100 p-2 rounded">Steve: Lorem ipsum dolor sit...</p>
        </div>
        <div className="text-right">
          <p className="inline-block bg-blue-100 p-2 rounded">You: Lorem ipsum dolor sit...</p>
        </div>
      </div>
      <textarea
        placeholder="Type your message..."
        className="mt-4 border p-2 rounded resize-none"
        rows="3"
      />
    </div>
  );
}
