import React, { useState, useCallback, FormEvent, ChangeEvent } from 'react';
import { useHistory } from 'react-router-dom';
import filesize from 'filesize';
import api from '../../services/api';

import Header from '../../components/Header';
import FileList from '../../components/FileList';
import Upload from '../../components/Upload';
import IncomeIcon from '../../assets/income.svg';
import OutcomeIcon from '../../assets/outcome.svg';

import {
  Container,
  Title,
  ImportFileContainer,
  Footer,
  FormContainer,
  TypesContainer,
  Income,
  Outcome,
} from './styles';

import alert from '../../assets/alert.svg';
import formatDate from '../../utils/formatDate';

interface FileProps {
  file: File;
  name: string;
  readableSize: string;
}
interface TransactionType {
  type: 'income' | 'outcome' | '';
}
interface FormProps {
  title: string;
  value: number;
  category: string;
}
interface Transaction extends FormProps {
  type: TransactionType | string;
}

const Import: React.FC = () => {
  const [formData, setFormData] = useState<FormProps>({} as FormProps);
  const [transactionType, setTransactionType] = useState<TransactionType>({
    type: '',
  });
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

  const createTransaction = useCallback(async (): Promise<void> => {
    try {
      const transaction: Transaction = {
        title: formData.title,
        value: Number(formData.value),
        type: transactionType.type,
        category: formData.category,
      };

      await api.post<Transaction>('/transactions', transaction);

      window.alert('Transação cadastrada com sucesso.💲');

      setFormData({
        category: '',
        title: '',
        value: 0,
      });

      setTransactionType({ type: '' });
    } catch (error) {
      window.alert('Confira todos os campos e tente novamente.');
    }
  }, [transactionType.type, formData]);

  const handleSelectType = useCallback((selectedType: TransactionType) => {
    const { type: newType } = selectedType;

    setTransactionType({ type: newType });
  }, []);

  const handleInputChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const { name, value } = event.target;
      setFormData({ ...formData, [name]: value });
    },
    [formData],
  );

  const handleSubmit = useCallback(
    async (event: FormEvent) => {
      event.preventDefault();
      await createTransaction();
    },
    [createTransaction],
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

      <FormContainer>
        <form autoComplete="off" onSubmit={handleSubmit}>
          <h2>Cadastro</h2>
          <input
            value={formData.title}
            type="text"
            name="title"
            id="title"
            placeholder="Nome"
            onChange={handleInputChange}
            required
          />
          <input
            value={formData.value}
            type="number"
            name="value"
            id="value"
            placeholder="Preço"
            onChange={handleInputChange}
            required
          />
          <TypesContainer>
            <Income
              isSelected={transactionType.type === 'income'}
              onClick={() => handleSelectType({ type: 'income' })}
            >
              <img src={IncomeIcon} alt="income" />
              <span>Entrada</span>
            </Income>
            <Outcome
              isSelected={transactionType.type === 'outcome'}
              onClick={() => handleSelectType({ type: 'outcome' })}
            >
              <img src={OutcomeIcon} alt="outcome" />
              <span>Retirada</span>
            </Outcome>
          </TypesContainer>
          <input
            value={formData.category}
            type="text"
            name="category"
            id="category"
            placeholder="Categoria"
            onChange={handleInputChange}
            required
          />

          <button type="submit">Cadastrar</button>
        </form>
      </FormContainer>
    </>
  );
};

export default Import;
