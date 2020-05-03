import styled from 'styled-components';

interface ContainerProps {
  size?: 'small' | 'large';
}

export const Container = styled.div<ContainerProps>`
  background: #5636d3;
  padding: 30px 0;

  header {
    width: 1120px;
    margin: 0 auto;
    padding: ${({ size }) => (size === 'small' ? '0 20px ' : '0 20px 150px')};
    display: flex;
    align-items: center;
    justify-content: space-between;

    nav {
      a {
        color: #fff;
        text-decoration: none;
        font-size: 16px;
        transition: opacity 0.2s;
        position:relative;
        & + a {
          margin-left: 32px;
        }
        &.active{
          &::after{
            content:"";
            position:absolute;
            width:100%;
            left:0px;
            bottom: -10px;
            border-bottom:2px solid #FF872C;
            animation: active-route 0.4s 1 linear forwards;
          }
        }
        &:hover {
          opacity: 0.6;
        }
      }
    }
  }

  @keyframes active-route {
    from{
      width:0%;
    }
    80%{
      width:115%;
    }
    to{
      width:100%
    }
  }
`;
