import React, { useState, useCallback } from 'react';
import { useHistory } from 'react-router-dom';

import filesize from 'filesize';

import Header from '../../components/Header';
import FileList from '../../components/FileList';
import Upload from '../../components/Upload';

import { Container, Title, ImportFileContainer, Footer } from './styles';

import alert from '../../assets/alert.svg';
import api from '../../services/api';

interface FileProps {
  file: File;
  name: string;
  readableSize: string;
}

const Import: React.FC = () => {
  const [uploadedFiles, setUploadedFiles] = useState<FileProps[]>([]);
  const [hasFiles, setHasFiles] = useState(false);
  const history = useHistory();

  const handleUpload = useCallback(() => {
    async function create(): Promise<void> {
      if (!uploadedFiles.length) return;

      uploadedFiles.forEach(async uploadedFile => {
        const data = new FormData();
        data.append('file', uploadedFile.file, uploadedFile.name);
        try {
          await api.post<File>('/transactions/import', data);
        } catch (err) {
          console.error(err.response.error);
        }
      });

      history.goBack();
    }

    create();
  }, [history, uploadedFiles]);

  const submitFile = useCallback(
    (files: File[]): void => {
      const formatedFiles: FileProps[] = files.map(file => ({
        file,
        name: file.name,
        readableSize: filesize(file.size, { exponent: -1, fullform: true }),
      }));

      setUploadedFiles([...uploadedFiles, ...formatedFiles]);

      setHasFiles(true);
    },
    [uploadedFiles],
  );

  return (
    <>
      <Header size="small" />
      <Container>
        <Title>Importar uma transação</Title>
        <ImportFileContainer>
          <Upload onUpload={submitFile} />
          {!!uploadedFiles.length && <FileList files={uploadedFiles} />}

          <Footer>
            <p>
              <img src={alert} alt="Alert" />
              Permitido apenas arquivos CSV
            </p>
            <button disabled={!hasFiles} onClick={handleUpload} type="button">
              Enviar
            </button>
          </Footer>
        </ImportFileContainer>
      </Container>
    </>
  );
};

export default Import;
