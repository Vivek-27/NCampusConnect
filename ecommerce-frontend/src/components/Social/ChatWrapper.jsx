import { FaCaretLeft } from 'react-icons/fa';
import { MdAttachFile, MdSend } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';

const ChatWrapper = () => {
  const navigate = useNavigate();

  return (
    <div
      draggable="true"
      className=" w-80 h-2/3 bg-white absolute center border rounded-2xl px-3 py-3 gap-2 flex flex-col shadow-2xl"
    >
      <div className=" w-full flex items-center justify-between px-5">
        <button
          onClick={() => navigate(-1)}
          className="text-xs text-gray-700 flex items-center"
        >
          <FaCaretLeft /> back
        </button>
        <h2 className="text-lg font-semibold text-gray-900">Message</h2>
        <p className=" text-xs text-red-500">Online</p>
      </div>
      <div className="h-full flex flex-col justify-between">
        <div className=" flex flex-col gap-2 w-full items-stretch">
          <div className="flex">
            <img
              src=""
              className="w-8 h-8 rounded-full border bg-lime-600"
              alt=""
            />
            <div className="border rounded-xl bg-gray-50 py-3 pl-2">
              Some message
            </div>
          </div>{' '}
          <div className=" flex">
            <div className="border rounded-xl text-left bg-gray-50 py-3 pl-2">
              Some message reply
            </div>
            <img
              src=""
              className="w-8 h-8 right-0 rounded-full border bg-lime-600"
              alt=""
            />
          </div>
        </div>
        <div className="w-full flex items-center justify-between gap-2">
          <div className="flex border rounded-3xl px-2 bg-white">
            <textarea
              type="text"
              placeholder="Message"
              className=" w-full text-md text-gray-800  py-2 px-3 rounded-xl outline-none"
            />
            <div className="flex">
              <button className="text-xl p-2 ">
                <MdAttachFile />
              </button>
            </div>
          </div>
          <button className="text-xl border p-2 rounded-full bg-green-400">
            <MdSend className="text-white" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatWrapper;
