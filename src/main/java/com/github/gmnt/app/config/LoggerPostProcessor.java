/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.github.gmnt.app.config;

import java.lang.reflect.Field;
import java.util.List;

import net.vidageek.mirror.dsl.Mirror;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.BeansException;
import org.springframework.beans.factory.config.BeanPostProcessor;
import org.springframework.stereotype.Component;

@Component
public class LoggerPostProcessor implements BeanPostProcessor {

    @Override
    public Object postProcessBeforeInitialization(Object bean, String beanName) throws BeansException {
        List<Field> fields = new Mirror().on(bean.getClass()).reflectAll().fields(); 
        for (Field field : fields) {
            if (Logger.class.isAssignableFrom(field.getType()) && new Mirror().on(field).reflect().annotation(InjectLogger.class) != null) {
                new Mirror().on(bean).set().field(field).withValue(LoggerFactory.getLogger(bean.getClass()));
            }
        }
        return bean;
    }

    @Override
    public Object postProcessAfterInitialization(Object bean, String beanName) throws BeansException {
        return bean;
    }
}