import styled, { css } from 'styled-components';
import { shade } from 'polished';

interface TypeProps {
  isSelected: boolean;
}

export const Container = styled.div`
  width: 100%;
  max-width: 736px;
  margin: 0 auto;
  padding: 40px 20px;
  @media (max-width: 768px) {
    display: none;
  }
`;

export const Title = styled.h1`
  font-weight: 500;
  font-size: 36px;
  line-height: 54px;
  color: #363f5f;
  text-align: center;
`;

export const ImportFileContainer = styled.section`
  background: #fff;
  margin-top: 40px;
  border-radius: 5px;
  padding: 64px;
`;

export const Footer = styled.section`
  margin-top: 36px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  p {
    display: flex;
    align-items: center;
    font-size: 12px;
    line-height: 18px;
    color: #969cb3;

    img {
      margin-right: 5px;
    }
  }

  button {
    background: #ff872c;
    color: #fff;
    border-radius: 5px;
    padding: 15px 80px;
    border: 0;
    transition: background-color 0.2s;
    &:hover {
      background: ${shade(0.2, '#ff872c')};
    }
    &:disabled {
      background: #888;
    }
  }
`;

export const FormContainer = styled.div`
  display: none;
  padding: 10px;
  @media (max-width: 768px) {
    display: grid;
  }

  animation: formCadastro 0.45s linear forwards;
  @keyframes formCadastro {
    from {
      opacity: 0.3;
      transform: translateX(-80px);
    }
    to {
      opacity: 1;
      transform: translateX(0px);
    }
  }
  justify-items: flex-start;

  grid-gap: 24px;

  h2 {
    font-weight: normal;
    line-height: 30px;
    margin-top: 24px;
    margin-bottom: 24px;
    font-size: 20px;
  }

  form {
    display: grid;
    grid-gap: 16px;
    max-width: 330px;
    width: 100%;
    justify-self: center;

    @media (max-width: 330px) {
      max-width: unset;
    }

    button {
      color: #fff;
      background-color: #ff872c;
      text-align: center;
    }
    input,
    button {
      height: 50px;
      border: none;
      border-radius: 5px;
      font-size: 14px;
    }
    input[type='text'],
    input[type='number'] {
      padding: 15px;
      background-color: #fff;

      &::placeholder {
        color: #969cb3;
      }
    }
  }
`;

export const TypesContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 8px;
`;

export const Income = styled.div<TypeProps>`
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1.5px solid;
  border-color: rgba(0, 0, 0, 0.05);
  border-radius: 5px;
  height: 50px;
  cursor: pointer;
  ${props =>
    props.isSelected &&
    css`
      border-color: #12a454;
    `}

  img {
    margin-right: 14px;
    height: 24px;
  }
  span {
    font-size: 14px;
    line-height: 21px;
  }
`;
export const Outcome = styled(Income)`
  ${props =>
    props.isSelected &&
    css`
      border-color: #e83f5b;
    `}
`;
