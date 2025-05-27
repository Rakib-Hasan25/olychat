'use client'
import React, { useState } from 'react'
import { MemoizedReactMarkdown } from '@/components/ai-chat/markdown'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import { Copy } from 'lucide-react'


type Props = { 
    content:any
}

const Markdowntohtml = ({ content }: Props) => {
    return (
      <div className="w-[97%] md:w-[90%] max-w-full">
      <MemoizedReactMarkdown
        className="prose prose-sm sm:prose-base lg:prose-base  w-full max-w-none break-words dark:prose-invert prose-p:leading-relaxed prose-pre:p-0"
        remarkPlugins={[remarkGfm, remarkMath]}
        components={{
          h1: ({ children }) => (
            <h1 className="w-full text-sm font-bold mb-1">{children}</h1>
          ),
          
          p: ({ children }) => (
            <p className="w-full mb-2 last:mb-0">{children}</p>
          ),
          code: ({ inline = false, className, children, ...props }: { inline?: boolean; className?: string; children?: React.ReactNode }) => {
            if (children && Array.isArray(children) && children.length) {
              if (typeof children[0] === 'string' && children[0] === '▍') {
                return <span className="cursor">▍</span>;
              }
              if (typeof children[0] === 'string') {
                children[0] = children[0].replace('`▍`', '▍');
              }
            }

            const match = /language-(\w+)/.exec(className || '');
            const isInline = !className?.includes('language-');

            if (isInline) {
              return (
                <code
                  className="px-1 py-0.5 rounded text-sm font-mono bg-gray-100 dark:bg-gray-800"
                  {...props}
                >
                  {children}
                </code>
              );
            }

            return (
              <CodeBlock
                key={Math.random()}
                language={(match && match[1]) || ''}
                value={String(children).replace(/\n$/, '')}
                {...props}
              />
            );
          },
        }}
      >
        {content}
      </MemoizedReactMarkdown>
    </div>
      )
}

export default Markdowntohtml



export function CodeBlock({ value }: { value: string; language: string }) {
  const [copyButtonText, setCopyButtonText] = useState('Copy Code');
  const copyToClipboard = () => {
    navigator.clipboard.writeText(value).then(() => {
      setCopyButtonText('Copied!');
      setTimeout(() => {
        setCopyButtonText('Copy Code');
      }, 2000); // Adjust the delay as needed
    }).catch((err) => {
      console.error('Failed to copy: ', err);
    });
  };

  return (
    <>
        <div  className=' w-full bg-slate-800 flex justify-end pr-2 py-1'>
          <span onClick={copyToClipboard} className='cursor-pointer flex font-extralight '>  <Copy className='w-3 mr-2'/>{copyButtonText} </span>
        </div>
      <div className="bg-black border-2  text-white rounded p-5 font-bold">
        
      <code className='text-[#E2725B]'>{value}</code>
      </div>
    </>
    )
  }

  /*

  # Difference Between **Machine Learning** and **Deep Learning**
 
 ## 1. Overview:
 Machine learning and deep learning are two subsets of artificial intelligence that involve methods to empower computers to learn and make decisions from data. While machine learning follows a more traditional approach, deep learning is a subfield that focuses on **artificial neural networks** and deep architectures.
 
 ## 2. Core Concepts:
 
 ### Machine Learning:
 - *Definition*: Machine learning is a method where algorithms learn from data and make predictions or decisions without being explicitly programmed.
   
 - *Example*: **Linear regression** is a classic machine learning technique used for predicting continuous numerical values. Below is a simple example in Python:
   
 ```python
 import numpy as np
 from sklearn.linear_model import LinearRegression
 
 # Training data
 X = np.array([[1], [2], [3]])
 y = np.array([2, 4, 6])
 
 # Create and train the model
 model = LinearRegression().fit(X, y)
 
 # Predict new values
 predictions = model.predict([[4], [5]])
 print(predictions)
 ```
 
 ### Deep Learning:
 - *Definition*: Deep learning is a subset of machine learning that uses **deep neural networks** to model and extract patterns from complex data.
   
 - *Example*: One of the most common deep learning architectures is the **Convolutional Neural Network (CNN)**, often used for image recognition tasks. Here is a simplified code snippet using Keras to build a basic CNN model:
 
 ```python
 from keras.models import Sequential
 from keras.layers import Conv2D, MaxPooling2D, Flatten, Dense
 
 # Create a Sequential model
 model = Sequential()
 
 # Add convolutional layers
 model.add(Conv2D(32, kernel_size=(3, 3), activation='relu', input_shape=(28, 28, 1)))
 model.add(MaxPooling2D(pool_size=(2, 2)))
 
 # Flatten the output for fully connected layers
 model.add(Flatten())
 
 # Add fully connected layers
 model.add(Dense(128, activation='relu'))
 model.add(Dense(10, activation='softmax'))
 
 # Compile the model
 model.compile(optimizer='adam', loss='categorical_crossentropy', metrics=['accuracy'])
 ```
 
 ## 3. Practice Exercises:
 - **Machine Learning Exercises**:
   1. Implement a decision tree algorithm from scratch in Python.
   2. Use the **Support Vector Machine (SVM)** algorithm to classify a dataset.
   
 - **Deep Learning Exercises**:
   1. Build a multi-layer perceptron (MLP) using TensorFlow for binary classification.
   2. Fine-tune a pre-trained deep learning model like **VGG16** for a different image recognition task.
 
 By understanding the differences and nuances between machine learning and deep learning, practitioners can choose the right technique to tackle various problems in the field of artificial intelligence effectively.
  */