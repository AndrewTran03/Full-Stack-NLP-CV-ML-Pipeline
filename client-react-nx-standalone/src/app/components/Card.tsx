import React, { useState } from 'react';
import axios from 'axios';
import { BACKEND_URL_BASE } from '../api/utils';
import { Button } from '@mui/material';

type Props = {
  title: string;
  content: string;
};

type PythonBE = {
  prediction: string;
};

const DEFAULT_PYTHON_BE: PythonBE = {
  prediction: '',
};

const Card: React.FC<Props> = ({ title, content }) => {
  const [, setClicked] = useState(false);
  const [pythonInfo, setPythonInfo] = useState<PythonBE>(DEFAULT_PYTHON_BE);
  const [pythonInfoLoading, setPythonInfoLoading] = useState(false);

  console.log('Card rendered');

  function handleClick(
    e: React.MouseEvent<HTMLButtonElement>,
    { hasClicked }: { hasClicked: boolean },
  ) {
    e.preventDefault();
    setClicked(hasClicked);
    alert('The link was clicked.');
  }

  async function handlePythonAPIButtonClick(
    e: React.MouseEvent<HTMLButtonElement>,
  ): Promise<void> {
    e.preventDefault();
    setPythonInfoLoading(true);
    await axios
      .post<string>(`${BACKEND_URL_BASE}/api/python`, { message: 'Python' })
      .then((res) => res.data)
      .then((data) => {
        console.log(`Response:`, data); // Logs the response string
        console.log(typeof data);
        const parsedResponse = JSON.parse(data) as PythonBE; // Parse the response string
        console.log(`Response:`, parsedResponse); // Logs the parsed response object
        setPythonInfo(parsedResponse);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setPythonInfo(DEFAULT_PYTHON_BE);
      });
    setPythonInfoLoading(false);
  }

  return (
    <div className="bg-white flex flex-col p-4 text-4xl font-bold underline color-black">
      <h2>{title}</h2>
      <p>{content}</p>
      <button onClick={(e) => handleClick(e, { hasClicked: true })}>
        Click me!
      </button>
      <Button onClick={handlePythonAPIButtonClick}>
        Click for Python Info!
      </Button>
      {!pythonInfoLoading &&
        pythonInfo.prediction &&
        pythonInfo.prediction.length > 0 && <h1>{pythonInfo.prediction}</h1>}
    </div>
  );
};

export default Card;
