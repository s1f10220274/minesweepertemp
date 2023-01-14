import type { NextPage } from 'next'
import Head from 'next/head'
import React, { useCallback, useEffect } from 'react'
import styled from 'styled-components'
import { Box, chakra, useInterval } from '@chakra-ui/react'
import { useState, useReducer, useMemo } from "react"
import { stringify } from 'querystring'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  min-height: 100vh;
  padding: 0 0.5rem;
`

const Main = styled.main`
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 5rem 0;
`

const Game = styled.div`
  margin: auto;
  position: relative;
  padding: 5px;
  width: 340px;
  height: 440px;
  border: 8px #000000;
  background-color: #8b8b8b;
`
const State = styled.div`
  display: flex;
  justify-content: center;
  margin: 5px;
  position: relative;
  height: 50px;
  border: 8px #000000;
  background-color: #d0d0d0;
`

const Frame = styled.div`
  margin: auto;
  position: relative;
  width: 320px;
  height: 360px;
  border: 8px #000000;
  background-color: #d0d0d0;
`

const Grid = styled.div`
  display: grid;
  place-items: auto;
  grid-template-columns: repeat(8, 40px);
  grid-template-rows: repeat(1, 40px);
`

const Griditem = styled.div`
  padding: 3px;
  border: 1px solid #eaeaea;
`

const Restart = styled.button`
  position: relative;
  margin: auto;
  height:35px;
  width:35px;
  background: url(${process.env.PUBLIC_URL}/minesweeper.png);
`

const Rock = styled.div`
  position: absolute;
  margin: auto;
  top: 0px;
  width: 320px;
  height: 360px;
  border: 8px #000000;
  background-color: #2e2e2e;
  opacity: 0.1;
`

const Bomb = styled.div`
  margin: auto;
  width: 100%;
  height: 100%;
  background: url(${process.env.PUBLIC_URL}/minesweeper.png);
  background-position: -300px;
`

const Num = styled.div`
  margin: auto;
  width: 100%;
  height: 100%;
  background: url(${process.env.PUBLIC_URL}/minesweeper.png) no-repeat;
`

const Block = styled.div`
  margin: auto;
  width: 100%;
  height: 100%;
  background-color: #ffffff;
`

const Flag = styled.div`
  margin: auto;
  width: 100%;
  height: 100%;
  background: url(${process.env.PUBLIC_URL}/minesweeper.png) no-repeat;
  background-position: -268px;
  background-color: #ffffff;
`

const Flagnum = styled.div`
  position: relative;
  margin: auto;
  height:35px;
  width:60px;
  font-size: 150%;
  text-align: center;
  color: red;
  background-color: #2a2a2a;
`

const Timer = styled.div`
  position: relative;
  margin: auto;
  height:35px;
  width:60px;
  font-size: 150%;
  text-align: center;
  color: red;
  background-color: #2a2a2a;
`

const HomePage: NextPage = () => {

  //void -> 0, bomb -> 1
  const [bomb, setBomb] = useState ([
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0]
  ]);

  const initialvalue = [
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0]
  ];
  //まだ -> 0, もう -> 1, flag -> 2
  const [reveal, setReveal] = useState(initialvalue);

  //nomal -> 0, win -> 1, lose -> 2
  const [judge, setJudge] = useState(0);

  const around = [
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0]
  ];

  const face = useMemo (() => {
    if (judge==0) {
      return -330;
    }else if (judge==1) {
      return -360;
    }else {
      return -390;
    }
  }, [judge]);

  const rock = useMemo(()=>{return judge===0?false:true},[judge]);

  const bombposition = useMemo (() => {return bomb.map((y, ydex) => {
    return y.map((x, xdex) => x==1?[ydex,xdex]:[]).filter(x => x.length === 2);
  }).flat()}, [bomb]);

  const numbercalc = useMemo (() => {
    const newAround: number[][] = JSON.parse(JSON.stringify(around));
    const direction: number[][] = [[1,1],[1,0],[1,-1],[0,1],[0,-1],[-1,1],[-1,0],[-1,-1]];
    bombposition.forEach((posi) => {
      direction.forEach((direc) => {
        newAround[posi[0]+direc[0]]!=undefined&&newAround[posi[0]+direc[0]][posi[1]+direc[1]]!=undefined&&newAround[posi[0]+direc[0]][posi[1]+direc[1]]++;
      });
    });
    return newAround
  }, [bomb]);

  const flagnum = useMemo (() => {
    return bombposition.length - reveal.flatMap(y => y.filter(x => x===2)).length;
  }, [reveal])

  const [count, setCount] = useState(0)

  useInterval(() => {
    setCount(prev => prev+1)
  }, judge == 0?1000:null)

  const resettimer = useMemo(() => {
    setCount(0);
    return count;
  }, [bomb])

  useEffect(()=>{
    if(reveal.flatMap(y => y.filter(x => x===2||x===0)).length - bombposition.length===0){
      setJudge(1);
      //凱旋処理
    }
  },[reveal])

  const randomset = () => {
    const initialval: number[][] = initialvalue.slice();
    const prob: number[] = [0, 0, 0, 0, 1];
    const newval:number[][] = initialval.map((y, ydex) => {
      return y.map((x, xdex) => {
        return x = prob[Math.floor(Math.random() * 4.9)]
      })
    })
    newval[7][6] = 0
    newval[7][7] = 0
    newval[8][6] = 0
    newval[8][7] = 0
    return newval
  };

  const unionsearcher = (y:number, x:number, array:number[][]) => {
    const direction: number[][] = [[1,0],[0,1],[0,-1],[-1,0],[1,1],[-1,1],[1,-1],[-1,-1]];

    array[y][x] = 1
    //if nowdirec + direc.foreach is (number||undefind):return
    direction.forEach((direc)=>{
      if (reveal[y+direc[0]]==undefined||reveal[y+direc[0]][x+direc[1]]==undefined) {
        return
      }else if (array[y+direc[0]][x+direc[1]]==1){
        return
      }else if (numbercalc[y+direc[0]][x+direc[1]]>=1){
        array[y+direc[0]][x+direc[1]] = 1
        return
      }else{//return unionsercher(nowdirec + alldirec) ->number[][]
        unionsearcher(y+direc[0],x+direc[1],array)
      }
    })
    return array
  }

  const revealed = (y:number, x:number) => {
    const newReveal: number[][] = JSON.parse(JSON.stringify(reveal));
    if (bomb[y][x] === 1) {
      setJudge(2);
      newReveal[y][x]=1;
      return newReveal;
      //敗戦処理 
    }else if(numbercalc[y][x] >= 1){
      newReveal[y][x]=1;
      return newReveal;
    }else{
      return unionsearcher(y,x,newReveal);
    }
  };

  const putflag = (y:number, x:number, flag:boolean) => {
    const newReveal: number[][] = JSON.parse(JSON.stringify(reveal));
    if (flag){
      newReveal[y][x] = 2
    }else{
      newReveal[y][x] = 0
    }
    return newReveal
  }

  useEffect(() => {
    const handler = () => {
      return false;
    }
    document.addEventListener('oncontextmenu', handler);
    return () => document.removeEventListener('oncontextmenu', handler);
  }, [])

  return (
    <Container>
      <Head>
        <title>Create Next App</title>
        <meta
          name="description"
          content="Generated by create next app"
        />
        <link
          rel="icon"
          href="favicon.ico"
        />
      </Head>
      <Main>
        <Game>
          <State>
            <Flagnum>{flagnum}</Flagnum>
            <Restart onClick={() => {
                setBomb(randomset);
                setReveal(initialvalue);
                setJudge(0);
              }} style={{backgroundPosition: face}}></Restart>
            <Timer>{count}</Timer>
          </State>
          <Frame>
              {reveal.map((y, ydex) => (
                  <Grid key = {ydex}>
                    {y.map((x, xdex) => (
                      <Griditem key={xdex}>
                        {x==0?
                          (<Block onClick={() => {setReveal((prev)=>revealed(ydex,xdex))}} onContextMenu={()=> setReveal(putflag(ydex,xdex,true))}></Block>):
                          x==2?
                            <Flag  onContextMenu={()=> setReveal(putflag(ydex,xdex,false))}></Flag>:
                            (bomb[ydex][xdex] === 1?
                              <Bomb></Bomb>:
                              (numbercalc[ydex][xdex] >= 1 && 
                                <Num style={{backgroundPosition: -(numbercalc[ydex][xdex]-1)*30}}></Num>))
                        }
                      </Griditem>
                    ))}
                  </Grid>
              ))}
            {rock === true && <Rock></Rock>}
          </Frame>
        </Game>
      </Main>
    </Container>
  )
}

export default HomePage